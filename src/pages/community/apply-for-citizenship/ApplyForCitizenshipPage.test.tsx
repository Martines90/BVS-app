import { toKeccak256HashToBytes32 } from '@global/helpers/hash-manipulation';
import { MOCK_CITIZENSHIP_APPLICATION_FEE, mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from 'test-utils';
import ApplyForCitizenshipPage from './ApplyForCitizenshipPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('ApplyForCitizenshipPage', () => {
  it('Should exist', () => {
    expect(ApplyForCitizenshipPage).toBeDefined();
  });

  describe('user with no citizenship and not applied for citizenship state', () => {
    it('should render expected view', async () => {
      await act(() => {
        render(<ApplyForCitizenshipPage />);
      });

      expect(
        screen.queryByText('Citizenship Application Board')
      ).toBeInTheDocument();

      expect(
        screen.queryByText('Citizenship application fee:', { exact: false })
      ).toBeInTheDocument();

      expect(screen.queryByText('10000 (wei)', { exact: false })).toBeInTheDocument();

      expect(mockContractFunctions.getCitizenRoleApplicationFee).toHaveBeenCalled();
    });

    it('should call applyForCitizenshipRole when clicked on Apply for citizenship button', async () => {
      const mockWallerAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
      const wrapperProps = { initUserState: { walletAddress: mockWallerAddress } };

      mockContractFunctions.applyForCitizenshipRole.mockImplementation(() => Promise.resolve());

      let container: any;
      await act(async () => {
        ({ container } = render(<ApplyForCitizenshipPage />, { wrapperProps }));
      });

      const emailInput = container.querySelector('input[name="email"]');

      await userEvent.type(emailInput, 'test@email.com');

      await userEvent.click(screen.getByRole('button', { name: 'Apply for citizenship' }));

      const expectedHash = toKeccak256HashToBytes32(`test@email.com${mockWallerAddress}`);

      expect(
        mockContractFunctions.applyForCitizenshipRole
      ).toHaveBeenCalledWith(expectedHash, MOCK_CITIZENSHIP_APPLICATION_FEE);

      expect(screen.queryByText('You citizenship application in the BVS blockchain contract already registered.')).toBeInTheDocument();
    });
  });

  describe('user who already has citizenship role', () => {
    it('should render expected view', async () => {
      const wrapperProps = { initUserState: { walletAddress: '0x0' } };

      mockContractFunctions.hasRole.mockImplementation(() => Promise.resolve(true));

      await act(() => {
        render(<ApplyForCitizenshipPage />, { wrapperProps });
      });

      expect(screen.queryByText('Your citizen role has already been granted!')).toBeInTheDocument();
    });
  });
});
