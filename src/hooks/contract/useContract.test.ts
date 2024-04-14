import { getBytes32keccak256Hash } from '@global/helpers/hash-manipulation';
import useContract from './useContract';

const mockContract = {
  applyForCitizenshipRole: jest.fn(() => Promise.resolve())
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
  });

  describe('elections', () => {
    it('should start new election', async () => {

    });
  });
});
