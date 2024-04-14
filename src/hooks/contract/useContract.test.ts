import { getBytes32keccak256Hash } from '@global/helpers/hash-manipulation';
import { ContractRoleskeccak256, USER_ROLES } from '@global/types/user';
import useContract from './useContract';

const mockFutureTimestamp = 2533566483;
const mockNonExistingAccountAddress = '0x0000000000000000000000000000000000000000';
const mockAccountKey = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

const mockApplyForCitizenshipHash = getBytes32keccak256Hash(
  `test@email.com${mockAccountKey}`
);

const mockContract = {
  applyForCitizenshipRole: jest.fn(() => Promise.resolve()),
  grantCitizenRole: jest.fn(() => Promise.resolve()),
  hasRole: jest.fn(() => Promise.resolve(true)),
  citizenshipApplications: jest.fn((publicKey) => {
    if (publicKey === mockAccountKey) {
      return Promise.resolve(mockApplyForCitizenshipHash);
    }
    return Promise.resolve(mockNonExistingAccountAddress);
  }),
  electionsStartDate: jest.fn(() => Promise.resolve(BigInt(0)))
};

jest.mock('@hooks/context/userContext/UserContext', () => ({
  useUserContext: () => ({
    userState: {
      contract: mockContract,
      walletAddress: mockAccountKey
    }
  })
}));

describe('useContract', () => {
  it('should exists', () => {
    expect(useContract).toBeDefined();
  });

  describe('roles', () => {
    describe('applyForCitizenshipRole', () => {
      it('should call applyForCitizenshipRole with proper values', async () => {
        const { applyForCitizenshipRole } = useContract();

        await applyForCitizenshipRole(mockApplyForCitizenshipHash, 10000);

        expect(mockContract.applyForCitizenshipRole).toHaveBeenCalledWith(
          mockApplyForCitizenshipHash,
          { from: mockAccountKey, value: 10000 }
        );
      });
    });

    describe('grantCitizenRole', () => {
      it('should call grantCitizenRole with proper values', async () => {
        const { grantCitizenRole } = useContract();

        await grantCitizenRole(mockAccountKey, mockApplyForCitizenshipHash);

        expect(mockContract.grantCitizenRole).toHaveBeenCalledWith(
          mockAccountKey,
          mockApplyForCitizenshipHash,
          false
        );
      });
    });

    describe('hasRole', () => {
      it('should call hasRole with proper values', async () => {
        const { hasRole } = useContract();

        await hasRole(USER_ROLES.CITIZEN, mockAccountKey);

        expect(mockContract.hasRole).toHaveBeenCalledWith(
          ContractRoleskeccak256.citizen,
          mockAccountKey
        );
      });
    });

    describe('isAccountAppliedForCitizenship', () => {
      it('should return true when public is in citizenshipApplications', async () => {
        const { isAccountAppliedForCitizenship } = useContract();

        expect(await isAccountAppliedForCitizenship(mockAccountKey)).toBe(true);
        expect(mockContract.citizenshipApplications).toHaveBeenCalledWith(mockAccountKey);
      });

      it('should return false when public is not in citizenshipApplications', async () => {
        const { isAccountAppliedForCitizenship } = useContract();

        const mockNonMatchAccountKey = '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6';

        expect(await isAccountAppliedForCitizenship(mockNonMatchAccountKey)).toBe(false);
        expect(mockContract.citizenshipApplications).toHaveBeenCalledWith(mockNonMatchAccountKey);
      });
    });

    describe('isHashMatchWithCitizenshipApplicationHash', () => {
      it('should return true when citizenshipApplications registered account has the validation hash', async () => {
        const { isHashMatchWithCitizenshipApplicationHash } = useContract();

        expect(
          await isHashMatchWithCitizenshipApplicationHash(
            mockAccountKey,
            mockApplyForCitizenshipHash
          )
        ).toBe(true);
        expect(mockContract.citizenshipApplications).toHaveBeenCalledWith(mockAccountKey);
      });

      it('should return false when citizenshipApplications has no registered account found', async () => {
        const { isHashMatchWithCitizenshipApplicationHash } = useContract();

        const mockNonMatchAccountKey = '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6';

        expect(
          await isHashMatchWithCitizenshipApplicationHash(
            mockNonMatchAccountKey,
            mockApplyForCitizenshipHash
          )
        ).toBe(false);
      });

      it('should return false when citizenshipApplications registered account dont match with validation hash', async () => {
        const { isHashMatchWithCitizenshipApplicationHash } = useContract();

        const nonMatchingApplicationHash = '9a336ae86908b51fb4a3e243af80709';

        expect(
          await isHashMatchWithCitizenshipApplicationHash(
            mockAccountKey,
            nonMatchingApplicationHash
          )
        ).toBe(false);
      });
    });
  });

  describe('elections', () => {
    describe('isThereOngoingElections', () => {
      it('should return false when electionsStartDate value is 0', async () => {
        mockContract.electionsStartDate.mockImplementationOnce(
          () => Promise.resolve(BigInt(0))
        );

        const { isThereOngoingElections } = useContract();

        expect(await isThereOngoingElections()).toBe(false);
      });

      it('should return true when electionsStartDate is not 0', async () => {
        mockContract.electionsStartDate.mockImplementationOnce(
          () => Promise.resolve(BigInt(mockFutureTimestamp))
        );

        const { isThereOngoingElections } = useContract();

        expect(await isThereOngoingElections()).toBe(true);
      });
    });
  });
});
