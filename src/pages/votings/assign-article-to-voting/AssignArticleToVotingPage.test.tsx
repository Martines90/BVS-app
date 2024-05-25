import { MOCK_PRO_CON_ARTICLES, MOCK_VOTING_KEY_HASHES, mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from 'test-utils';
import AssignArticleToVotingPage from './AssignArticleToVotingPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('AssignArticleToVotingPage', () => {
  let container: any;

  it('Should exist', () => {
    expect(AssignArticleToVotingPage).toBeDefined();
  });

  it('should render voting related articles and assign new article', async () => {
    await act(async () => {
      ({ container } = render(<AssignArticleToVotingPage />));
    });

    expect(screen.queryByText('Assign pro/con articles to voting')).toBeInTheDocument();

    const votingKeyInputField = container.querySelector('input[name="voting-key"]');
    const loadVotingBtn = screen.getByRole('button', { name: 'LOAD VOTING' });

    await userEvent.type(votingKeyInputField, MOCK_VOTING_KEY_HASHES[0]);
    await userEvent.click(loadVotingBtn);

    expect(screen.queryByText('Article Key')).toBeInTheDocument();
    expect(screen.queryByText('Content IPFS hash')).toBeInTheDocument();
    expect(screen.queryByText('Vote on A (yes)')).toBeInTheDocument();
    expect(screen.queryByText('Approved')).toBeInTheDocument();

    for (let i = 0; i < MOCK_PRO_CON_ARTICLES.length; i++) {
      expect(screen.queryByText(String(MOCK_PRO_CON_ARTICLES[i].articleKey))).toBeInTheDocument();
      expect(screen.queryByText(
        String(MOCK_PRO_CON_ARTICLES[i].articleIpfsHash)
      )).toBeInTheDocument();
    }

    expect(screen.queryByText('Assign new pro/con article')).toBeInTheDocument();

    const ipfsHashInputField = container.querySelector('input[name="contentIpfsHash"]');

    await userEvent.type(ipfsHashInputField, 'test-ipfs-hash-key-4');

    await userEvent.click(screen.getByRole('button', { name: 'ASSIGN' }));

    expect(mockContractFunctions.assignArticleToVoting).toHaveBeenCalledWith(
      MOCK_VOTING_KEY_HASHES[0],
      'test-ipfs-hash-key-4',
      true
    );
  });
});
