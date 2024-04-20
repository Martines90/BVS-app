import { TimeQuantities } from '@global/constants/general';
import { MOCK_CANDIDATE_ACCOUNT_KEYS, MOCK_CANDIDATE_SCORES, mockContractFunctions } from '@mocks/contract-mocks';
import {
  act, render, screen
} from 'test-utils';
import OngoingScheduledElectionsPage from './OngoingScheduledElectionsPage';

const mockFutureTimestamp = 2533566483000; // 2050. April 14.

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

jest.mock('@components/links/LinkInText', () => ({ children }: { children: any }) => <div>{children}</div>);

describe('OngoingScheduledElectionsPage', () => {
  it('Should exist', () => {
    expect(OngoingScheduledElectionsPage).toBeDefined();
  });

  it('should render no ongoing elections text when there is no ongoing elections', async () => {
    await act(async () => {
      render(<OngoingScheduledElectionsPage />);
    });

    expect(screen.queryByText('Ongoing & next elections')).toBeInTheDocument();
    expect(screen.queryByText('There is no ongoing or upcoming elections.')).toBeInTheDocument();

    expect(screen.queryByText('Elections start:')).not.toBeInTheDocument();
  });

  it('should render elections info when there is ongoing/upcoming elections', async () => {
    const totalScore = Object.keys(MOCK_CANDIDATE_SCORES).reduce(
      (previousValue, currentValue) => previousValue + MOCK_CANDIDATE_SCORES[currentValue],
      0
    );

    const mockRegisteredCandidates = [
      {
        publicKey: MOCK_CANDIDATE_ACCOUNT_KEYS[0],
        score: MOCK_CANDIDATE_SCORES[MOCK_CANDIDATE_ACCOUNT_KEYS[0]]
      },
      {
        publicKey: MOCK_CANDIDATE_ACCOUNT_KEYS[1],
        score: MOCK_CANDIDATE_SCORES[MOCK_CANDIDATE_ACCOUNT_KEYS[1]]
      },
      {
        publicKey: MOCK_CANDIDATE_ACCOUNT_KEYS[2],
        score: MOCK_CANDIDATE_SCORES[MOCK_CANDIDATE_ACCOUNT_KEYS[2]]
      }
    ].map((candidateData) => (
      { ...candidateData, percentage: ((candidateData.score / totalScore) * 1000) / 10 }
    ));

    mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(mockFutureTimestamp))
    );

    mockContractFunctions.getElectionsEndDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(mockFutureTimestamp + TimeQuantities.MONTH * 1000))
    );

    await act(async () => {
      render(<OngoingScheduledElectionsPage />);
    });

    expect(screen.queryByText('Ongoing & next elections')).toBeInTheDocument();
    expect(screen.queryByText('There is no ongoing or upcoming elections.')).not.toBeInTheDocument();

    expect(screen.queryByText('Elections start:')).toBeInTheDocument();
    expect(screen.queryByText('14/04/2050')).toBeInTheDocument();
    expect(screen.queryByText('Elections end:')).toBeInTheDocument();
    expect(screen.queryByText('14/05/2050')).toBeInTheDocument();

    expect(screen.queryAllByText('Vote on candidate').length).toBe(3);
    for (let i = 0; i < mockRegisteredCandidates.length; i++) {
      expect(screen.queryByText(mockRegisteredCandidates[i].publicKey)).toBeInTheDocument();
      expect(screen.queryByText(mockRegisteredCandidates[i].score)).toBeInTheDocument();
      expect(screen.queryByText(mockRegisteredCandidates[i].percentage)).toBeInTheDocument();
    }
  });
});
