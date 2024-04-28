import { TimeQuantities } from '@global/constants/general';
import { mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import {
  act, render, screen
} from 'test-utils';
import CreateNewVotingPage from './CreateNewVotingPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

const mockNowTimestamp = 1713467901248; // 2024. April 18., Thursday 19:18:21.248

jest.mock('@global/helpers/date', () => {
  const actual = jest.requireActual('@global/helpers/date');
  return {
    ...actual,
    getNow: () => mockNowTimestamp
  };
});

jest.mock('@components/links/LinkInText', () => ({ children }: { children: any }) => <div>{children}</div>);

describe('CreateNewVotingPage', () => {
  let container: any;
  it('Should exist', () => {
    expect(CreateNewVotingPage).toBeDefined();
  });

  it('should render default view', async () => {
    mockContractFunctions.getFirstVotingCycleStartDate.mockImplementationOnce(
      () => Promise.resolve(mockNowTimestamp - TimeQuantities.DAY * 1000 - 1233489)
    );

    await act(async () => {
      ({ container } = render(<CreateNewVotingPage />));
    });

    expect(mockContractFunctions.getFirstVotingCycleStartDate).toHaveBeenCalled();
    expect(mockContractFunctions.getPoliticalActorVotingCredits).toHaveBeenCalled();
    expect(mockContractFunctions.getVotingCycleInterval).toHaveBeenCalled();
    expect(mockContractFunctions.getVotingCycleMinCloseToTheEndTime).toHaveBeenCalled();
    expect(mockContractFunctions.getPoliticalActorVotingCycleVoteStartCount).toHaveBeenCalled();

    expect(screen.queryByText('Schedule new voting')).toBeInTheDocument();

    expect(screen.queryByText('Voting cycle:')).toBeInTheDocument();
    expect(screen.queryByText('1.')).toBeInTheDocument();

    expect(screen.queryByText('Voting cycle ends:')).toBeInTheDocument();
    expect(screen.queryByText('28 days, 23 hours, 39 minutes')).toBeInTheDocument();

    expect(screen.queryByText('Number of voting credits left:')).toBeInTheDocument();
    expect(screen.queryByText('2/3')).toBeInTheDocument();

    const startDateInput = screen.getByTestId('start-date');

    await userEvent.click(startDateInput);

    await userEvent.click(screen.getByText('29'));

    expect(screen.getByDisplayValue('29/04/2024')).toHaveAttribute('name', 'start-date-field');

    const contentIpfsHashField = container.querySelector('input[name="contentIpfsHash"]');

    await userEvent.type(contentIpfsHashField, 'test-ipfs-hash');

    const targetBudgetField = container.querySelector('input[name="targetBudget"]');

    await userEvent.clear(targetBudgetField);
    await userEvent.type(targetBudgetField, '10000');

    await userEvent.click(screen.getByRole('button', { name: 'CREATE' }));

    expect(mockContractFunctions.scheduleNewVoting).toHaveBeenCalledWith(
      'test-ipfs-hash',
      1714341600,
      10000
    );

    expect(screen.queryByText('1/3')).toBeInTheDocument();
  });
});
