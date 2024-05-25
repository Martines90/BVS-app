/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { IPFS_GATEWAY_URL } from '@global/constants/general';
import { MOCK_PRO_CON_ARTICLES, mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import {
  act, render, screen
} from 'test-utils';
import ApproveResponsePage from './ApproveResponsePage';

import { apiBaseUrl } from '@global/config';
import { toBytes32ToKeccak256 } from '@global/helpers/hash-manipulation';
import axios from 'axios';

jest.mock('axios');

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('ApproveResponsePage', () => {
  let container: any;
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should exist', () => {
    expect(ApproveResponsePage).toBeDefined();
  });

  it('should render article info and assign ipfs content check docs and related answers', async () => {
    const mockTestFile = new File(['(⌐□_□)'], 'test-file.pdf', { type: 'application/pdf' });

    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockReturnValueOnce(Promise.resolve({
      status: 200,
      data: { ipfsHashKey: 'file-upload-generated-ipfs-hash' }
    }));

    const spyWindowOpen = jest.spyOn(window, 'open');
    spyWindowOpen.mockImplementationOnce(jest.fn());

    await act(async () => {
      ({ container } = render(<ApproveResponsePage />));
    });

    const article = MOCK_PRO_CON_ARTICLES[1];

    expect(screen.queryByText('Approve article response')).toBeInTheDocument();

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
    expect(mockContractFunctions.getMinTotalQuizCheckAnswers).toHaveBeenCalled();
    expect(
      mockContractFunctions.getArticleResponseContentReadCheckAnswersLength
    ).toHaveBeenCalledWith(
      article.articleKey
    );

    expect(screen.queryByText('Response approved:')).toBeInTheDocument();
    expect(screen.queryByText('no')).toBeInTheDocument();

    expect(screen.queryByText('Response content description')).toBeInTheDocument();

    expect(screen.queryByText('Assign IPFS Quiz hash')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'ASSIGN IPFS HASH TO RESPONSE' })).toBeDisabled();

    expect(screen.getByRole('button', { name: 'VIEW' })).toBeDisabled();

    expect(screen.queryByText('IPFS content check quiz hash has to be assigned before')).toBeInTheDocument();

    // file upload scenario to have IPFS hash

    const fileInput = screen.getByTestId('pdf-file-upload-input');
    await userEvent.upload(fileInput, mockTestFile);

    const formData = new FormData();
    formData.append('file', mockTestFile);

    expect(axios.post).toHaveBeenCalledWith(`${apiBaseUrl}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    // lets view the document

    await userEvent.click(screen.getByRole('button', { name: 'VIEW' }));

    expect(spyWindowOpen).toHaveBeenCalledWith(`${IPFS_GATEWAY_URL}/file-upload-generated-ipfs-hash`, '_blank', 'rel=noopener noreferrer');

    expect(screen.queryByRole('button', { name: 'ASSIGN IPFS HASH TO RESPONSE' })).toBeEnabled();

    expect(container.querySelector('input[value="file-upload-generated-ipfs-hash"]')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'ASSIGN IPFS HASH TO RESPONSE' }));

    expect(mockContractFunctions.assignQuizIpfsHashToResponse).toHaveBeenCalledWith(
      article.votingKey,
      article.articleKey,
      'file-upload-generated-ipfs-hash'
    );

    expect(container.querySelector('input[name="contentIpfsHash"]')).toBeDisabled();
    expect(screen.queryByText('IPFS content check quiz hash has to be assigned before')).not.toBeInTheDocument();

    expect(screen.queryByText('Added answers count:')).toBeInTheDocument();
    expect(screen.queryByText('0 / 10')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ASSIGN ANSWERS TO RESPONSE' })).not.toBeEnabled();

    const mockAnswers = [
      'test answer 1',
      'test answer 2',
      'test answer 3',
      'test answer 4',
      'test answer 5',
      'test answer 6',
      'test answer 7',
      'test answer 8',
      'test answer 9',
      'test answer 10'
    ];

    const newAnswerField = container.querySelector('input[name="new-answer"]');
    const addAnswerBtn = screen.queryByRole('button', { name: 'ADD' });

    for (const mockAnswer of mockAnswers) {
      await userEvent.type(newAnswerField, mockAnswer);
      if (addAnswerBtn) await userEvent.click(addAnswerBtn);
      expect(screen.queryByText(mockAnswer)).toBeInTheDocument();
    }

    expect(screen.queryByText('10 / 10')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ASSIGN ANSWERS TO RESPONSE' })).toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'ASSIGN ANSWERS TO RESPONSE' }));

    expect(mockContractFunctions.addAnswersToResponseContent).toHaveBeenCalledWith(
      article.votingKey,
      article.articleKey,
      mockAnswers.map((answer) => toBytes32ToKeccak256(answer))
    );

    expect(screen.queryByText('yes')).toBeInTheDocument();
  });
});
