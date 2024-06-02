import { ONE_GWEI } from '@global/constants/general';
import { mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from 'test-utils';
import ConstantsPage from './ConstantsPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('ConstantsPage', () => {
  let container: any;

  it('Should exist', () => {
    expect(ConstantsPage).toBeDefined();
  });

  describe('there is upcoming elections and user not yet registered as a candidate', () => {
    it('should render expected content and call contract functions', async () => {
      await act(() => {
        ({ container } = render(<ConstantsPage />));
      });

      expect(mockContractFunctions.getCitizenRoleApplicationFee).toHaveBeenCalled();
      expect(mockContractFunctions.getElectionCandidateApplicationFee).toHaveBeenCalled();

      const citizenshipApplicationFeeInput = container.querySelector('input[name="citizenship-application-fee"]');
      const candidateRegistrationFeeInput = container.querySelector('input[name="candidate-application-fee"]');

      expect(citizenshipApplicationFeeInput).toHaveValue('0.00001');
      expect(candidateRegistrationFeeInput).toHaveValue('0.0001');

      await userEvent.clear(citizenshipApplicationFeeInput);
      await userEvent.clear(candidateRegistrationFeeInput);

      await userEvent.type(citizenshipApplicationFeeInput, '10000000');
      await userEvent.type(candidateRegistrationFeeInput, '20000000');

      expect(
        screen.queryByText('Constants & config')
      ).toBeInTheDocument();

      await userEvent.click(screen.getAllByRole('button', { name: 'UPDATE' })[0]);

      expect(mockContractFunctions.updateCitizenshipApplicationFee).toHaveBeenCalledWith(
        BigInt(10000000) * BigInt(ONE_GWEI)
      );

      await userEvent.click(screen.getAllByRole('button', { name: 'UPDATE' })[1]);

      expect(mockContractFunctions.updateElectionsApplicationFee).toHaveBeenCalledWith(
        BigInt(20000000) * BigInt(ONE_GWEI)
      );
    });
  });
});
