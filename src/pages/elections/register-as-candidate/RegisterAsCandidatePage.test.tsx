import { MOCK_REGISTER_AS_CANDIDATE_FEE, mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from 'test-utils';
import RegisterAsCandidatePage from './RegisterAsCandidatePage';

const mockFutureTimestamp = 2533566483000; // 2050. April 14.
const mockPastTimestamp = 1672531200000;

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('RegisterAsCandidatePage', () => {
  it('Should exist', () => {
    expect(RegisterAsCandidatePage).toBeDefined();
  });

  describe('there is upcoming elections and user not yet registered as a candidate', () => {
    it('should render expected content and call contract functions', async () => {
      mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
        () => Promise.resolve(mockFutureTimestamp)
      );

      await act(() => {
        render(<RegisterAsCandidatePage />);
      });

      expect(mockContractFunctions.getElectionsStartDate).toHaveBeenCalled();
      expect(mockContractFunctions.isCandidateAlreadyApplied).toHaveBeenCalled();
      expect(mockContractFunctions.getElectionCandidateApplicationFee).toHaveBeenCalled();

      expect(
        screen.queryByText('Candidate Registration Form')
      ).toBeInTheDocument();

      expect(
        screen.queryByText('Next elections will start on: 14/04/2050', { exact: false })
      ).toBeInTheDocument();

      expect(
        screen.queryByText('Candidate application fee:', { exact: false })
      ).toBeInTheDocument();

      expect(
        screen.queryByText(`${MOCK_REGISTER_AS_CANDIDATE_FEE} (wei)`, { exact: false })
      ).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Register as candidate' })).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Register as candidate' }));

      expect(mockContractFunctions.applyForElectionsAsCandidate).toHaveBeenCalledWith(
        MOCK_REGISTER_AS_CANDIDATE_FEE
      );
    });
  });

  describe('there is no ongoing elections', () => {
    it('should render expected content', async () => {
      await act(() => {
        render(<RegisterAsCandidatePage />);
      });

      expect(
        screen.queryByText('There is no ongoing or upcoming election.')
      ).toBeInTheDocument();
    });
  });

  describe('there is an upcoming election and user already registered as a candidate', () => {
    it('should render expected content', async () => {
      mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
        () => Promise.resolve(mockFutureTimestamp)
      );

      mockContractFunctions.isCandidateAlreadyApplied.mockImplementationOnce(
        () => Promise.resolve(true)
      );

      await act(() => {
        render(<RegisterAsCandidatePage />);
      });

      expect(
        screen.queryByText('Your already registered as candidate.')
      ).toBeInTheDocument();
    });
  });

  describe('user not registered as a candidate but elections already started', () => {
    it('should render expected content', async () => {
      mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
        () => Promise.resolve(mockPastTimestamp)
      );

      await act(() => {
        render(<RegisterAsCandidatePage />);
      });

      expect(
        screen.queryByText('Elections already stared (01/01/2023).', { exact: false })
      ).toBeInTheDocument();

      expect(
        screen.queryByText('Candidate registration is not anymore open.', { exact: false })
      ).toBeInTheDocument();
    });
  });
});
