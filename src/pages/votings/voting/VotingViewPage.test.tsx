import { formatDateTime } from '@global/helpers/date';
import { MOCK_VOTINGS, MOCK_VOTING_KEY_HASHES, mockContractFunctions } from '@mocks/contract-mocks';
import {
  act, mockedUseLocation, render, screen
} from 'test-utils';
import VotingViewPage from './VotingViewPage';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: 'abc' } },
  Document: () => (
    <div>
      Document
    </div>
  ),
  Outline: null,
  Page: () => <div>def</div>
}));

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

mockedUseLocation.mockReturnValue({
  hash: `#voting?voting_key=${MOCK_VOTING_KEY_HASHES[0]}`
});

describe('VotingViewPage', () => {
  it('Should exist', () => {
    expect(VotingViewPage).toBeDefined();
  });

  it('should render voting info', async () => {
    await act(async () => {
      render(<VotingViewPage />);
    });

    const voting = MOCK_VOTINGS[MOCK_VOTING_KEY_HASHES[0]];

    expect(screen.queryByText('Voting')).toBeInTheDocument();

    expect(screen.queryByText('Key:')).toBeInTheDocument();
    expect(screen.queryByText(voting.key)).toBeInTheDocument();

    expect(screen.queryByText('Start date:')).toBeInTheDocument();
    expect(screen.queryByText(formatDateTime(voting.startDate) as string)).toBeInTheDocument();
  });
});
