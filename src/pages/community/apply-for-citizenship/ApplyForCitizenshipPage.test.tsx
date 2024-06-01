import { toBytes32ToKeccak256 } from '@global/helpers/hash-manipulation';
import { MOCK_CITIZENSHIP_APPLICATION_FEE, mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from 'test-utils';
import ApplyForCitizenshipPage from './ApplyForCitizenshipPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

const mockNowTimestamp = 1713467901248; // 2024. April 18., Thursday 19:18:21.248

jest.mock('@global/helpers/date', () => {
  const actual = jest.requireActual('@global/helpers/date');
  return {
    ...actual,
    getNow: () => mockNowTimestamp
  };
});

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

      const firstNameInput = container.querySelector('input[name="firstName"]');
      const middleNames = container.querySelector('input[name="middleNames"]');
      const lastName = container.querySelector('input[name="lastName"]');

      const birthCountry = container.querySelector('input[name="birthCountry"]');
      const birthState = container.querySelector('input[name="birthState"]');
      const birthCity = container.querySelector('input[name="birthCity"]');

      await userEvent.type(firstNameInput, 'Mathew');
      await userEvent.type(middleNames, 'Evans');
      await userEvent.type(lastName, 'Wilkins');

      const birthDateInput = screen.getByTestId('birth-date');

      await userEvent.click(birthDateInput);

      await userEvent.click(screen.getByText('19'));

      expect(screen.getByDisplayValue('19/04/2024')).toHaveAttribute('name', 'birth-date-field');

      await userEvent.type(birthCountry, 'United States');
      await userEvent.type(birthState, 'Idaho');
      await userEvent.type(birthCity, 'Challis');

      await userEvent.click(screen.getByRole('button', { name: 'Apply for citizenship' }));

      const inputs = '';
      const expectedHash = toBytes32ToKeccak256(
        inputs.concat(
          'Mathew',
          'Evans',
          'Wilkins',
          '19/04/2024',
          'United States',
          'Idaho',
          'Challis',
          mockWallerAddress
        )
      );

      expect(
        mockContractFunctions.applyForCitizenshipRole
      ).toHaveBeenCalledWith(expectedHash, MOCK_CITIZENSHIP_APPLICATION_FEE);

      expect(screen.queryByText('You citizenship application successfully registered into the blockchain network')).toBeInTheDocument();

      expect(screen.queryByText('Step 1: Apply for citizenship (completed)')).toBeInTheDocument();
      expect(screen.queryByText('Send your application info to', { exact: false })).toBeInTheDocument();

      expect(screen.queryByText('Important! Make sure your application email contains:')).toBeInTheDocument();
      expect(screen.queryByText('*Your public key:')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Apply for citizenship' })).toBeDisabled();
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
