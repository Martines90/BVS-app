/* eslint-disable no-await-in-loop */
import { TimeQuantities } from '@global/constants/general';
import * as dateHelpers from '@global/helpers/date';
import { ProConArticle } from '@hooks/contract/types';
import { MOCK_FUTURE_TIMESTAMP } from '@mocks/common-mocks';
import {
  MOCK_ARTICLE_KEYS,
  MOCK_VOTINGS,
  MOCK_VOTING_KEY_HASHES,
  mockAccountPublicKeys,
  mockContractFunctions
} from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import {
  act, mockedUseLocation, render, screen
} from 'test-utils';
import VotingViewPage from './VotingViewPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

const MOCK_PRO_CON_ARTICLES_APPROVED: ProConArticle[] = [
  ...MOCK_ARTICLE_KEYS.map((articleKey, index) => (
    {
      articleKey,
      votingKey: MOCK_VOTING_KEY_HASHES[0],
      isArticleApproved: true,
      isResponseApproved: true,
      publisher: mockAccountPublicKeys[0],
      articleIpfsHash: `article-test-ipfs-hash-${index}`,
      isVoteOnA: true,
      responseStatementIpfsHash: `response-statement-ipfs-hash-${index}`,
      articleContentCheckQuizIpfsHash: `article-content-check-quiz-ipfs-hash-${index}`,
      responseContentCheckQuizIpfsHash: `response-content-test-ipfs-hash-${index}`
    }
  ))
];

describe('VotingViewPage', () => {
  let container: any;
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should exist', () => {
    expect(VotingViewPage).toBeDefined();
  });

  it('should render voting info', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => MOCK_FUTURE_TIMESTAMP + (TimeQuantities.DAY) * 1000);

    mockedUseLocation.mockReturnValue({
      hash: `#voting?voting_key=${MOCK_VOTING_KEY_HASHES[0]}`
    });

    mockContractFunctions.getAccountVotingScore.mockReturnValueOnce(Promise.resolve(1533));
    mockContractFunctions.getAccountVote.mockReturnValueOnce(Promise.resolve({
      voted: false, isContentQuizCompleted: true
    }));

    mockContractFunctions.getVotingContentReadCheckAnswersLength.mockReturnValue(
      Promise.resolve(10)
    );

    mockContractFunctions.getArticleContentReadCheckAnswersLength.mockReturnValue(
      Promise.resolve(10)
    );

    mockContractFunctions.getArticleResponseContentReadCheckAnswersLength.mockReturnValue(
      Promise.resolve(10)
    );

    mockContractFunctions.getVotingAssignedArticlesPublished.mockReturnValue(
      Promise.resolve(MOCK_PRO_CON_ARTICLES_APPROVED)
    );

    await act(async () => {
      ({ container } = render(<VotingViewPage />));
    });

    const voting = MOCK_VOTINGS[MOCK_VOTING_KEY_HASHES[0]];

    expect(screen.queryByText('There is no existing voting under this key.')).not.toBeInTheDocument();

    expect(screen.queryByText('Voting')).toBeInTheDocument();

    expect(screen.queryByText('Key:')).toBeInTheDocument();
    expect(container.querySelector(`input[value="${voting.key}"]`)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'LOAD VOTING' })).toBeEnabled();

    expect(screen.queryByText('Start date:')).toBeInTheDocument();
    expect(screen.queryByText('14/04/2050')).toBeInTheDocument();

    expect(screen.queryByText('Approved:')).toBeInTheDocument();
    expect(screen.queryByText('Active:')).toBeInTheDocument();
    expect(screen.queryByText('Voted:')).toBeInTheDocument();
    expect(screen.queryByText('Content check quiz completed:')).toBeInTheDocument();
    expect(screen.queryAllByText('yes').length).toBe(3);
    expect(screen.queryAllByText('no').length).toBe(1);

    expect(screen.queryByText('Total number of votes:')).toBeInTheDocument();
    expect(screen.queryByText('44')).toBeInTheDocument();

    expect(screen.queryByText('Score on "Yes":')).toBeInTheDocument();
    expect(screen.queryByText('12445')).toBeInTheDocument();

    expect(screen.queryByText('Score on "No":')).toBeInTheDocument();
    expect(screen.queryByText('23334')).toBeInTheDocument();

    expect(screen.queryByText('Your voting score:')).toBeInTheDocument();
    expect(screen.queryByText('1533')).toBeInTheDocument();

    expect(screen.queryByText('Voting content description')).toBeInTheDocument();
    expect(screen.queryByText('Voting content check quiz')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'YES' })).toBeEnabled();
    expect(screen.queryByRole('button', { name: 'NO' })).toBeEnabled();

    // let's vote
    const voteOnABtn = screen.getByRole('button', { name: 'YES' });

    await userEvent.click(voteOnABtn);

    expect(screen.queryByRole('button', { name: 'YES' })).not.toBeEnabled();
    expect(screen.queryByRole('button', { name: 'NO' })).not.toBeEnabled();
    expect(screen.queryAllByText('yes').length).toBe(4);
    expect(screen.queryAllByText('no').length).toBe(0);

    // type new voting key and load new voting info

    const voting2 = MOCK_VOTINGS[MOCK_VOTING_KEY_HASHES[1]];
    const votingKeyInputField = container.querySelector('input[name="voting-key"]');
    const loadVoting = screen.getByRole('button', { name: 'LOAD VOTING' });

    await userEvent.clear(votingKeyInputField);
    await userEvent.type(votingKeyInputField, MOCK_VOTING_KEY_HASHES[1]);

    await userEvent.click(loadVoting);

    expect(screen.queryByText('07/04/2050')).toBeInTheDocument();

    expect(screen.queryAllByText('no').length).toBe(3);
    expect(screen.queryAllByText('yes').length).toBe(1);
    expect(screen.queryByText('333')).toBeInTheDocument();
    expect(screen.queryByText('45')).toBeInTheDocument();

    // let's complete voting quiz

    await userEvent.click(screen.getByText('Voting content check quiz'));

    const answersToVotingCheck = [];
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i of [2, 6, 10, 8, 1]) {
      const answerField1 = container.querySelector(`input[name="answer-${i}"]`);
      await userEvent.type(answerField1, `test answer ${i}`);
      answersToVotingCheck.push(`test answer ${i}`);
    }

    await userEvent.click(screen.getByRole('button', { name: 'COMPLETE QUIZ' }));

    expect(mockContractFunctions.completeVotingContentCheckQuiz).toHaveBeenCalledWith(
      voting2.key,
      answersToVotingCheck
    );

    expect(screen.queryAllByText('no').length).toBe(2);
    expect(screen.queryAllByText('yes').length).toBe(2);

    await userEvent.click(screen.getByText('Voting content check quiz'));

    // complete article

    expect(screen.queryByText('Assigned pro/con articles & responses')).toBeInTheDocument();

    await userEvent.click(screen.getByText('1# article (vote on A) - approved: yes'));
    await userEvent.click(screen.getByText('Content check quiz'));

    const answersToArticleContentCheck = [];
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i of [3, 9, 4, 1, 2]) {
      const answerField1 = container.querySelector(`input[name="answer-${i}"]`);
      await userEvent.type(answerField1, `test answer ${i}`);
      answersToArticleContentCheck.push(`test answer ${i}`);
    }

    await userEvent.click(screen.getByRole('button', { name: 'COMPLETE QUIZ' }));

    expect(mockContractFunctions.completeArticleContentCheckQuiz).toHaveBeenCalledWith(
      voting2.key,
      MOCK_PRO_CON_ARTICLES_APPROVED[0].articleKey,
      answersToArticleContentCheck
    );

    await userEvent.click(screen.getByText('1# article (vote on A) - approved: yes'));

    // complete response

    await userEvent.click(screen.getByText('Response on article 1# - approved: yes'));
    await userEvent.click(screen.getByText('Content check quiz'));

    const answersToArticleResponseContentCheck = [];
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const i of [3, 9, 1, 6, 5]) {
      const answerField1 = container.querySelector(`input[name="answer-${i}"]`);
      await userEvent.type(answerField1, `test answer ${i}`);
      answersToArticleResponseContentCheck.push(`test answer ${i}`);
    }

    await userEvent.click(screen.getByRole('button', { name: 'COMPLETE QUIZ' }));

    expect(mockContractFunctions.completeArticleResponseContentCheckQuiz).toHaveBeenCalledWith(
      voting2.key,
      MOCK_PRO_CON_ARTICLES_APPROVED[0].articleKey,
      answersToArticleResponseContentCheck
    );

    // check all the articles & responses

    let i = 0;
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const article of MOCK_PRO_CON_ARTICLES_APPROVED) {
      expect(
        screen.queryByText(
          `${i + 1}# article (vote on ${article.isVoteOnA ? 'A' : 'B'}) - approved: ${article.isArticleApproved ? 'yes' : 'no'}`
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          `Response on article ${i + 1}# - approved: ${article.isResponseApproved ? 'yes' : 'no'}`
        )
      ).toBeInTheDocument();
      i++;
    }

    // Try load non existing voting

    await userEvent.clear(votingKeyInputField);
    await userEvent.type(votingKeyInputField, 'dfkljsdfklédfsjskdélf');

    await userEvent.click(loadVoting);

    expect(screen.queryByText('There is no existing voting under this key.')).toBeInTheDocument();
  });
});
