import { formatDateTime } from '@global/helpers/date';
import { MOCK_VOTINGS, MOCK_VOTING_KEY_HASHES, mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import {
  act, mockedUseNavigate, render, screen
} from 'test-utils';
import AllVotingsPage from './AllVotingsPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('AllVotingsPage', () => {
  it('Should exist', () => {
    expect(AllVotingsPage).toBeDefined();
  });

  it('should render votings', async () => {
    await act(async () => {
      render(<AllVotingsPage />);
    });

    expect(screen.queryByText('Total number of votings:')).toBeInTheDocument();

    const viewButtons = screen.getAllByRole('button', { name: 'VISIT' });

    for (let i = 0; i < MOCK_VOTING_KEY_HASHES.length; i++) {
      const voting = MOCK_VOTINGS[MOCK_VOTING_KEY_HASHES[i]];
      expect(screen.queryByText(formatDateTime(voting.startDate) as string)).toBeInTheDocument();
      expect(screen.queryByText(voting.key)).toBeInTheDocument();
      expect(screen.queryByText(voting.contentIpfsHash)).toBeInTheDocument();
    }

    expect(screen.queryAllByText('no').length).toBe(1);
    expect(screen.queryAllByText('yes').length).toBe(2);

    await userEvent.click(viewButtons[0]);
    expect(mockedUseNavigate).toHaveBeenCalledWith(`/votings#voting?voting_key=${MOCK_VOTING_KEY_HASHES[2]}`);

    await userEvent.click(viewButtons[1]);
    expect(mockedUseNavigate).toHaveBeenCalledWith(`/votings#voting?voting_key=${MOCK_VOTING_KEY_HASHES[1]}`);

    await userEvent.click(viewButtons[2]);
    expect(mockedUseNavigate).toHaveBeenCalledWith(`/votings#voting?voting_key=${MOCK_VOTING_KEY_HASHES[0]}`);
  });
});
