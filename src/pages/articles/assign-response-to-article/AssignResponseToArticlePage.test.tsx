import { MOCK_PRO_CON_ARTICLES, mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from 'test-utils';
import AssignResponseToArticlePage from './AssignResponseToArticlePage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('AssignResponseToArticlePage', () => {
  let container: any;

  it('Should exist', () => {
    expect(AssignResponseToArticlePage).toBeDefined();
  });

  it('should render article related responses and assign new response', async () => {
    await act(async () => {
      ({ container } = render(<AssignResponseToArticlePage />));
    });

    expect(screen.queryByText('Assign response to article')).toBeInTheDocument();

    const article = MOCK_PRO_CON_ARTICLES[0];

    const votingKeyInputField = container.querySelector('input[name="voting-key"]');
    const articleKeyInputField = container.querySelector('input[name="article-key"]');
    const loadArticleBtn = screen.getByRole('button', { name: 'LOAD ARTICLE' });

    await userEvent.type(votingKeyInputField, String(article.votingKey));
    await userEvent.type(articleKeyInputField, String(article.articleKey));
    await userEvent.click(loadArticleBtn);

    expect(mockContractFunctions.getArticleAtKey).toHaveBeenCalledWith(
      article.votingKey,
      article.articleKey
    );

    expect(screen.queryByText('Article approved')).toBeInTheDocument();
    expect(screen.queryByText('Article response approved')).toBeInTheDocument();
    expect(screen.queryByText('Has assigned response')).toBeInTheDocument();
    expect(screen.queryByText('View article content')).toBeInTheDocument();

    expect(screen.queryAllByText('yes').length).toBe(0);
    expect(screen.queryAllByText('no').length).toBe(3);

    const ipfsHashInputField = container.querySelector('input[name="contentIpfsHash"]');

    await userEvent.type(ipfsHashInputField, 'test-ipfs-hash-key-4');

    await userEvent.click(screen.getByRole('button', { name: 'ASSIGN' }));

    expect(mockContractFunctions.assignResponseIpfsHashToArticle).toHaveBeenCalledWith(
      article.votingKey,
      article.articleKey,
      'test-ipfs-hash-key-4'
    );

    expect(screen.queryAllByText('yes').length).toBe(1);
    expect(screen.queryAllByText('no').length).toBe(2);
    expect(ipfsHashInputField).toBeDisabled();
  });
});
