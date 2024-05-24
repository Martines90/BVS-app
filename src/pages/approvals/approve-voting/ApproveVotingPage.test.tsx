/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { IPFS_GATEWAY_URL, TimeQuantities } from '@global/constants/general';
import * as dateHelpers from '@global/helpers/date';
import { MOCK_FUTURE_TIMESTAMP } from '@mocks/common-mocks';
import { MOCK_VOTINGS, MOCK_VOTING_KEY_HASHES, mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import {
  act, render, screen
} from 'test-utils';
import ApproveVotingPage from './ApproveVotingPage';

import { apiBaseUrl } from '@global/config';
import { toBytes32ToKeccak256 } from '@global/helpers/hash-manipulation';
import axios from 'axios';

jest.mock('axios');

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('ApproveVotingPage', () => {
  let container: any;
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should exist', () => {
    expect(ApproveVotingPage).toBeDefined();
  });

  it('should render voting info and go through happy path', async () => {
    const mockTestFile = new File(['(⌐□_□)'], 'test-file.pdf', { type: 'application/pdf' });

    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockReturnValueOnce(Promise.resolve({
      status: 200,
      data: { ipfsHashKey: 'file-upload-generated-ipfs-hash' }
    }));

    const spyWindowOpen = jest.spyOn(window, 'open');
    spyWindowOpen.mockImplementationOnce(jest.fn());

    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => MOCK_FUTURE_TIMESTAMP + (6 * TimeQuantities.DAY) * 1000);

    await act(async () => {
      ({ container } = render(<ApproveVotingPage />));
    });

    const voting = MOCK_VOTINGS[MOCK_VOTING_KEY_HASHES[3]];

    const votingKeyInputField = container.querySelector('input[name="voting-key"]');
    const loadVotingBtn = screen.getByRole('button', { name: 'LOAD VOTING' });

    await userEvent.type(votingKeyInputField, MOCK_VOTING_KEY_HASHES[3]);
    await userEvent.click(loadVotingBtn);

    expect(mockContractFunctions.getVotingAtKey).toHaveBeenCalledWith(voting.key);
    expect(mockContractFunctions.getMinTotalQuizCheckAnswers).toHaveBeenCalled();
    expect(mockContractFunctions.getVotingContentReadCheckAnswersLength).toHaveBeenCalledWith(
      voting.key
    );
    expect(mockContractFunctions.getApproveVotingMinTimeAfterLimit).toHaveBeenCalled();

    expect(screen.queryByText('Approve voting')).toBeInTheDocument();

    expect(screen.queryByText('Approved:')).toBeInTheDocument();
    expect(screen.queryByText('no')).toBeInTheDocument();

    expect(screen.queryByText('Approve deadline:')).toBeInTheDocument();
    expect(screen.queryByText('22/04/2050 18:28')).toBeInTheDocument();

    expect(screen.queryByText('Target budget (gwei):')).toBeInTheDocument();
    expect(screen.queryByText('1999')).toBeInTheDocument();

    expect(screen.queryByText('Voting content description')).toBeInTheDocument();

    expect(screen.queryByText('Assign IPFS Quiz hash')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'ASSIGN IPFS HASH TO VOTING' })).toBeDisabled();

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

    expect(screen.queryByRole('button', { name: 'ASSIGN IPFS HASH TO VOTING' })).toBeEnabled();

    expect(container.querySelector('input[value="file-upload-generated-ipfs-hash"]')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'ASSIGN IPFS HASH TO VOTING' }));

    expect(mockContractFunctions.assignQuizIpfsHashToVoting).toHaveBeenCalledWith(voting.key, 'file-upload-generated-ipfs-hash');

    expect(container.querySelector('input[name="contentIpfsHash"]')).toBeDisabled();
    expect(screen.queryByText('IPFS content check quiz hash has to be assigned before')).not.toBeInTheDocument();

    expect(screen.queryByText('Added answers count:')).toBeInTheDocument();
    expect(screen.queryByText('0 / 10')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ASSIGN ANSWERS TO VOTING' })).not.toBeEnabled();

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
    expect(screen.queryByRole('button', { name: 'ASSIGN ANSWERS TO VOTING' })).toBeEnabled();

    expect(screen.queryByRole('button', { name: 'APPROVE' })).not.toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'ASSIGN ANSWERS TO VOTING' }));

    expect(mockContractFunctions.addAnswersToVotingContent).toHaveBeenCalledWith(
      voting.key,
      mockAnswers.map((answer) => toBytes32ToKeccak256(answer))
    );

    expect(screen.queryByRole('button', { name: 'APPROVE' })).toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'APPROVE' }));

    expect(mockContractFunctions.approveVoting).toHaveBeenCalledWith(voting.key);
    expect(screen.queryByText('yes')).toBeInTheDocument();
  });

  it('should render voting what is cant approve yet (outside of approve date interval)', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => MOCK_FUTURE_TIMESTAMP - (2 * TimeQuantities.WEEK) * 1000);

    await act(async () => {
      ({ container } = render(<ApproveVotingPage />));
    });

    const votingKeyInputField = container.querySelector('input[name="voting-key"]');
    const loadVotingBtn = screen.getByRole('button', { name: 'LOAD VOTING' });

    await userEvent.type(votingKeyInputField, MOCK_VOTING_KEY_HASHES[1]);
    await userEvent.click(loadVotingBtn);

    expect(screen.queryByText('07/04/2050 18:28')).toBeInTheDocument();

    expect(screen.queryByText('Voting can be approved between:', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('04/04/2050 18:28 and', { exact: false })).toBeInTheDocument();
    expect(screen.queryAllByText('07/04/2050 18:28', { exact: false }).length).toBe(2);
  });
});
