import { act, render, screen } from 'test-utils';
import ApplyForCitizenshipPage from './ApplyForCitizenshipPage';

const mockContractFunctions = {
  getCitizenRoleApplicationFee: jest.fn(() => 10000),
  isAccountAppliedForCitizenship: jest.fn(() => false),
  hasRole: jest.fn(() => false),
  applyForCitizenshipRole: jest.fn()
};

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('ApplyForCitizenshipPage', () => {
  it('Should exist', () => {
    expect(ApplyForCitizenshipPage).toBeDefined();
  });

  describe('user with no citizenship and not applied for citizenship state', () => {
    it('should render default view', async () => {
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

    it('should execute application when clicked on Apply for citizenship button', async () => {

    });
  });

  describe('user who already has citizenship role', () => {
    it('should render expected view', async () => {
      mockContractFunctions.hasRole.mockImplementation(() => true);

      await act(() => {
        render(<ApplyForCitizenshipPage />, { wrapperProps: { initUserState: { walletAddress: '0x0' } } });
      });

      expect(screen.queryByText('Your citizen role has already been granted!')).toBeInTheDocument();
    });
  });
});
