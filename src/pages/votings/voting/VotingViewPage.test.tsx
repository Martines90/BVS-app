import { TimeQuantities } from '@global/constants/general';
import * as dateHelpers from '@global/helpers/date';
import { MOCK_FUTURE_TIMESTAMP } from '@mocks/common-mocks';
import { MOCK_VOTINGS, MOCK_VOTING_KEY_HASHES, mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import {
  act, mockedUseLocation, render, screen
} from 'test-utils';
import VotingViewPage from './VotingViewPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

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
    expect(screen.queryAllByText('yes').length).toBe(2);

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

    // type new voting key and load new voting info

    const votingKeyInputField = container.querySelector('input[name="voting-key"]');
    const loadVoting = screen.getByRole('button', { name: 'LOAD VOTING' });

    await userEvent.clear(votingKeyInputField);
    await userEvent.type(votingKeyInputField, MOCK_VOTING_KEY_HASHES[1]);

    await userEvent.click(loadVoting);

    expect(screen.queryByText('07/04/2050')).toBeInTheDocument();

    expect(screen.queryAllByText('no').length).toBe(1);
    expect(screen.queryAllByText('yes').length).toBe(1);
    expect(screen.queryByText('333')).toBeInTheDocument();
    expect(screen.queryByText('45')).toBeInTheDocument();

    // Try load non existing voting

    await userEvent.clear(votingKeyInputField);
    await userEvent.type(votingKeyInputField, 'dfkljsdfklédfsjskdélf');

    await userEvent.click(loadVoting);

    expect(screen.queryByText('There is no existing voting under this key.')).toBeInTheDocument();
  });
});
