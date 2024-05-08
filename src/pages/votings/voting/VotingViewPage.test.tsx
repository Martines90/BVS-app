import { formatDateTime } from '@global/helpers/date';
import { MOCK_VOTINGS, MOCK_VOTING_KEY_HASHES, mockContractFunctions } from '@mocks/contract-mocks';
import {
  act, mockedUseLocation, render, screen
} from 'test-utils';
import VotingViewPage from './VotingViewPage';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: 'abc' } },
  Document: ({ onLoadSuccess = (pdf = { numPages: 4 }) => pdf.numPages }) => (
    <div>{
    onLoadSuccess({ numPages: 4 })
    }
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

  it('should render votings', async () => {
    await act(async () => {
      render(<VotingViewPage />);
    });

    expect(screen.queryByText('Voting')).toBeInTheDocument();
  });
});
