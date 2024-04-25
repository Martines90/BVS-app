import { TimeQuantities } from '@global/constants/general';
import { MOCK_CANDIDATE_ACCOUNT_KEYS, MOCK_CANDIDATE_SCORES, mockContractFunctions } from '@mocks/contract-mocks';
import {
  act, render, screen
} from 'test-utils';
import OngoingScheduledElectionsPage from './OngoingScheduledElectionsPage';

import { to2DecimalFixed } from '@global/helpers/calculation';
import * as dateHelpers from '@global/helpers/date';
import { MOCK_FUTURE_TIMESTAMP } from '@mocks/common-mocks';
import userEvent from '@testing-library/user-event';

const mockTotalScore = Object.keys(MOCK_CANDIDATE_SCORES).reduce(
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
  { ...candidateData, percentage: to2DecimalFixed(candidateData.score / mockTotalScore) }
));

/*
  const mockNowTimestamp = 1713467901248; // 2024. April 18., Thursday 19:18:21.248

  jest.mock('@global/helpers/date', () => {
    const actual = jest.requireActual('@global/helpers/date');
    return {
      ...actual,
      getNow: () => mockNowTimestamp
    };
  });
*/

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
    mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP))
    );

    mockContractFunctions.getElectionsEndDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP + TimeQuantities.MONTH * 1000))
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
      expect(screen.getAllByText(/Vote on candidate/i)[i].closest('button')).toBeDisabled();
    }
  });

  it('should show candidates vote on button enabled when elections is active', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => MOCK_FUTURE_TIMESTAMP + TimeQuantities.DAY * 1000);

    mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP))
    );

    mockContractFunctions.getElectionsEndDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP + TimeQuantities.MONTH * 1000))
    );

    const mockWallerAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const wrapperProps = { initUserState: { walletAddress: mockWallerAddress } };

    await act(async () => {
      render(<OngoingScheduledElectionsPage />, { wrapperProps });
    });

    for (let i = 0; i < mockRegisteredCandidates.length; i++) {
      expect(screen.queryByText(mockRegisteredCandidates[i].publicKey)).toBeInTheDocument();
      expect(screen.queryByText(mockRegisteredCandidates[i].score)).toBeInTheDocument();
      expect(screen.queryByText(mockRegisteredCandidates[i].percentage)).toBeInTheDocument();
      expect(screen.getAllByText(/Vote on candidate/i)[i].closest('button')).toBeEnabled();
    }
  });

  it('should show candidate with disabled vote on button when it\'s address is the same as the user\'s', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => MOCK_FUTURE_TIMESTAMP + TimeQuantities.DAY * 1000);

    mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP))
    );

    mockContractFunctions.getElectionsEndDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP + TimeQuantities.MONTH * 1000))
    );

    const mockWallerAddress = MOCK_CANDIDATE_ACCOUNT_KEYS[1];
    const wrapperProps = { initUserState: { walletAddress: mockWallerAddress } };

    await act(async () => {
      render(<OngoingScheduledElectionsPage />, { wrapperProps });
    });

    expect(screen.getAllByText(/Vote on candidate/i)[0].closest('button')).toBeEnabled();
    expect(screen.getAllByText(/Vote on candidate/i)[1].closest('button')).toBeDisabled();
    expect(screen.getAllByText(/Vote on candidate/i)[2].closest('button')).toBeEnabled();
  });

  it('should disable all vote on button when i already voted and also has to show candidate at first place with extra information', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => MOCK_FUTURE_TIMESTAMP + TimeQuantities.DAY * 1000);

    mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP))
    );

    mockContractFunctions.getElectionsEndDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP + TimeQuantities.MONTH * 1000))
    );

    mockContractFunctions.getVotedOnCandidatePublicKey.mockImplementationOnce(
      () => Promise.resolve(MOCK_CANDIDATE_ACCOUNT_KEYS[2])
    );

    const mockWallerAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const wrapperProps = { initUserState: { walletAddress: mockWallerAddress } };

    await act(async () => {
      render(<OngoingScheduledElectionsPage />, { wrapperProps });
    });
    expect(screen.queryByText('You voted on this candidate')).toBeInTheDocument();

    expect(screen.getAllByText(/Vote on candidate/i)[0].closest('button')).toBeDisabled();
    expect(screen.getAllByText(/Vote on candidate/i)[1].closest('button')).toBeDisabled();
  });

  it('should call voteOnElectionsCandidate function when user click on vote on button', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => MOCK_FUTURE_TIMESTAMP + TimeQuantities.DAY * 1000);

    mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP))
    );

    mockContractFunctions.getElectionsEndDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP + TimeQuantities.MONTH * 1000))
    );

    const mockWallerAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const wrapperProps = { initUserState: { walletAddress: mockWallerAddress } };

    await act(async () => {
      render(<OngoingScheduledElectionsPage />, { wrapperProps });
    });

    expect(screen.getAllByText(/Vote on candidate/i).length).toBe(3);
    expect(screen.queryByText('133')).toBeInTheDocument();
    expect(screen.queryByText('61.86')).toBeInTheDocument();

    const firstVoteOnButton = screen.getAllByText(/Vote on candidate/i)[0].closest('button');
    if (firstVoteOnButton) await userEvent.click(firstVoteOnButton);

    expect(
      mockContractFunctions.voteOnElectionsCandidate
    ).toHaveBeenCalledWith(MOCK_CANDIDATE_ACCOUNT_KEYS[0]);

    expect(screen.queryByText('You voted on this candidate')).toBeInTheDocument();
    expect(screen.getAllByText(/Vote on candidate/i).length).toBe(2);
    expect(screen.queryByText('134')).toBeInTheDocument();
    expect(screen.queryByText('62.04')).toBeInTheDocument();
  });
});
