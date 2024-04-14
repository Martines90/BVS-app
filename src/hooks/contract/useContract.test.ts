import { getBytes32keccak256Hash } from '@global/helpers/hash-manipulation';
import { ContractRoleskeccak256, USER_ROLES } from '@global/types/user';
import useContract from './useContract';

const mockContract = {
  applyForCitizenshipRole: jest.fn(() => Promise.resolve()),
  grantCitizenRole: jest.fn(() => Promise.resolve()),
  hasRole: jest.fn(() => Promise.resolve(true))
};

jest.mock('@hooks/context/userContext/UserContext', () => ({
  useUserContext: () => ({
    userState: {
      contract: mockContract,
      walletAddress: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    }
  })
}));

describe('useContract', () => {
  it('should exists', () => {
    expect(useContract).toBeDefined();
  });

  describe('roles', () => {
    it('applyForCitizenshipRole', async () => {
      const { applyForCitizenshipRole } = useContract();

      const mockHash = getBytes32keccak256Hash(
        'test@email.com0x0'
      );
      await applyForCitizenshipRole(mockHash, 10000);

      expect(mockContract.applyForCitizenshipRole).toHaveBeenCalledWith(
        '0x3036363736323464666265643064353435346665383339623132323663656100',
        { from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', value: 10000 }
      );
    });

    it('grantCitizenRole', async () => {
      const { grantCitizenRole } = useContract();

      const mockHash = getBytes32keccak256Hash(
        'test@email.com0x0'
      );

      await grantCitizenRole('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', mockHash);

      expect(mockContract.grantCitizenRole).toHaveBeenCalledWith(
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        mockHash,
        false
      );
    });

    it('hasRole', async () => {
      const { hasRole } = useContract();

      await hasRole(USER_ROLES.CITIZEN, '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266');

      expect(mockContract.hasRole).toHaveBeenCalledWith(
        ContractRoleskeccak256.citizen,
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
      );
    });
  });

  describe('elections', () => {

  });
});
