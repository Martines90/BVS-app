import { TimeQuantities } from '@global/constants/general';
import { getBytes32keccak256Hash } from '@global/helpers/hash-manipulation';
import { ContractRoleskeccak256, USER_ROLES } from '@global/types/user';
import { MOCK_CITIZENSHIP_APPLICATION_FEE, MOCK_REGISTER_AS_CANDIDATE_FEE } from '@mocks/contract-mocks';
import useContract from './useContract';

const mockFutureTimestamp = 2533566483;
const mockNonExistingAccountAddress = '0x0000000000000000000000000000000000000000';
const mockAccountKey = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';

const mockApplyForCitizenshipHash = getBytes32keccak256Hash(
  `test@email.com${mockAccountKey}`
);

const mockContract = {
  ELECTION_START_END_INTERVAL: jest.fn(() => Promise.resolve(BigInt(TimeQuantities.MONTH))),
  applyForCitizenshipRole: jest.fn(() => Promise.resolve()),
  applyForElections: jest.fn(() => Promise.resolve()),
  electionsCandidateApplicationFee: jest.fn(
    () => Promise.resolve(MOCK_REGISTER_AS_CANDIDATE_FEE)
  ),
  electionCandidateScores: jest.fn((accountKey) => {
    if (accountKey === mockAccountKey) {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  grantCitizenRole: jest.fn(() => Promise.resolve()),
  hasRole: jest.fn(() => Promise.resolve(true)),
  citizenshipApplications: jest.fn((publicKey) => {
    if (publicKey === mockAccountKey) {
      return Promise.resolve(mockApplyForCitizenshipHash);
    }
    return Promise.resolve(mockNonExistingAccountAddress);
  }),
  electionsStartDate: jest.fn(() => Promise.resolve(BigInt(0))),
  electionsEndDate: jest.fn(() => Promise.resolve(BigInt(0))),
  scheduleNextElections: jest.fn(() => Promise.resolve()),
  citizenRoleApplicationFee: jest.fn(() => Promise.resolve(
    BigInt(MOCK_CITIZENSHIP_APPLICATION_FEE)
  ))
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

        await applyForCitizenshipRole(
          mockApplyForCitizenshipHash,
          MOCK_CITIZENSHIP_APPLICATION_FEE
        );

        expect(mockContract.applyForCitizenshipRole).toHaveBeenCalledWith(
          mockApplyForCitizenshipHash,
          { from: mockAccountKey, value: MOCK_CITIZENSHIP_APPLICATION_FEE }
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
    describe('applyForElectionsAsCandidate', () => {
      it('should call applyForElections contract function', async () => {
        const { applyForElectionsAsCandidate } = useContract();

        await applyForElectionsAsCandidate(MOCK_REGISTER_AS_CANDIDATE_FEE);
        expect(mockContract.applyForElections).toHaveBeenCalled();
      });
    });

    describe('isCandidateAlreadyApplied', () => {
      it('should call electionCandidateScores and return false when account not applied as candidate', async () => {
        const { isCandidateAlreadyApplied } = useContract();

        expect(await isCandidateAlreadyApplied(mockNonExistingAccountAddress)).toBe(false);
        expect(mockContract.electionCandidateScores).toHaveBeenCalledWith(
          mockNonExistingAccountAddress
        );
      });

      it('should call electionCandidateScores and return false when account is applied as candidate', async () => {
        const { isCandidateAlreadyApplied } = useContract();

        expect(await isCandidateAlreadyApplied(mockAccountKey)).toBe(true);
        expect(mockContract.electionCandidateScores).toHaveBeenCalledWith(
          mockAccountKey
        );
      });
    });

    describe('isThereOngoingElections', () => {
      it('should return false when electionsStartDate value is 0', async () => {
        mockContract.electionsStartDate.mockImplementationOnce(
          () => Promise.resolve(BigInt(0))
        );

        const { isThereOngoingElections } = useContract();

        expect(await isThereOngoingElections()).toBe(false);
        expect(mockContract.electionsStartDate).toHaveBeenCalled();
      });

      it('should return true when electionsStartDate is not 0', async () => {
        mockContract.electionsStartDate.mockImplementationOnce(
          () => Promise.resolve(BigInt(mockFutureTimestamp))
        );

        const { isThereOngoingElections } = useContract();

        expect(await isThereOngoingElections()).toBe(true);
      });
    });

    describe('scheduleNextElections', () => {
      it('should call scheduleNextElections with proper values', async () => {
        const { scheduleNextElections } = useContract();

        const electionDates = {
          startDate: mockFutureTimestamp,
          endDate: mockFutureTimestamp + TimeQuantities.MONTH
        };

        await scheduleNextElections(
          electionDates.startDate,
          electionDates.endDate
        );

        expect(mockContract.scheduleNextElections).toHaveBeenCalledWith(
          BigInt(electionDates.startDate),
          BigInt(electionDates.endDate)
        );
      });
    });

    describe('getCitizenRoleApplicationFee', () => {
      it('should call electionsCandidateApplicationFee and return application fee', async () => {
        const { getElectionCandidateApplicationFee } = useContract();

        expect(await getElectionCandidateApplicationFee()).toBe(MOCK_REGISTER_AS_CANDIDATE_FEE);
        expect(mockContract.electionsCandidateApplicationFee).toHaveBeenCalled();
      });
    });
  });

  describe('getters', () => {
    describe('getCitizenRoleApplicationFee', () => {
      it('should call citizenRoleApplicationFee and return application fee', async () => {
        const { getCitizenRoleApplicationFee } = useContract();

        expect(await getCitizenRoleApplicationFee()).toBe(MOCK_CITIZENSHIP_APPLICATION_FEE);
        expect(mockContract.scheduleNextElections).toHaveBeenCalled();
      });
    });

    describe('getElectionStartEndIntervalInDays', () => {
      it('should call ELECTION_START_END_INTERVAL and get day format', async () => {
        const { getElectionStartEndIntervalInDays } = useContract();

        expect(await getElectionStartEndIntervalInDays()).toBe(
          TimeQuantities.MONTH / TimeQuantities.DAY
        );
        expect(mockContract.ELECTION_START_END_INTERVAL).toHaveBeenCalled();
      });
    });

    describe('getElectionsStartDate', () => {
      it('should call electionsStartDate and return election start date value', async () => {
        mockContract.electionsStartDate.mockImplementationOnce(
          () => Promise.resolve(BigInt(mockFutureTimestamp))
        );

        const { getElectionsStartDate } = useContract();

        expect(await getElectionsStartDate()).toBe(mockFutureTimestamp * 1000);
        expect(mockContract.electionsStartDate).toHaveBeenCalled();
      });
    });

    describe('getElectionsEndDate', () => {
      it('should call electionsEndDate and return election end date value', async () => {
        mockContract.electionsEndDate.mockImplementationOnce(
          () => Promise.resolve(BigInt(mockFutureTimestamp))
        );

        const { getElectionsEndDate } = useContract();

        expect(await getElectionsEndDate()).toBe(mockFutureTimestamp * 1000);
        expect(mockContract.electionsEndDate).toHaveBeenCalled();
      });
    });
  });
});
