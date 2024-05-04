import { TimeQuantities } from '@global/constants/general';
import { mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import {
  act, render, screen
} from 'test-utils';
import CreateNewVotingPage from './CreateNewVotingPage';

import * as dateHelpers from '@global/helpers/date';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

const mockNowTimestamp = 1713467901248; // 2024. April 18., Thursday 19:18:21.248

jest.mock('@components/links/LinkText', () => ({ children }: { children: any }) => <div>{children}</div>);

describe('CreateNewVotingPage', () => {
  let container: any;
  it('Should exist', () => {
    expect(CreateNewVotingPage).toBeDefined();
  });

  it('should render default view', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => mockNowTimestamp);

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

    expect(screen.getByRole('button', { name: 'VIEW' })).toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'CREATE' }));

    expect(mockContractFunctions.scheduleNewVoting).toHaveBeenCalledWith(
      'test-ipfs-hash',
      1714341600,
      10000
    );

    expect(screen.queryByText('1/3')).toBeInTheDocument();
  });

  it('should disable CREATE button and show warning text when voting cycle end is within 10 days', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => mockNowTimestamp + TimeQuantities.DAY * 20 * 1000);

    mockContractFunctions.getFirstVotingCycleStartDate.mockImplementationOnce(
      () => Promise.resolve(mockNowTimestamp - TimeQuantities.DAY * 1000 - 1233489)
    );

    await act(async () => {
      ({ container } = render(<CreateNewVotingPage />));
    });

    expect(screen.queryByText('Voting cycle ends:')).toBeInTheDocument();
    expect(screen.queryByText('8 days, 23 hours, 39 minutes')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'CREATE' })).toBeDisabled();

    expect(screen.queryByText('New voting can start only 10 days before ongoing voting cycle ends')).toBeInTheDocument();
  });

  it('should display no more voting credits warning', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => mockNowTimestamp);

    mockContractFunctions.getFirstVotingCycleStartDate.mockImplementationOnce(
      () => Promise.resolve(mockNowTimestamp - TimeQuantities.DAY * 1000 - 1233489)
    );

    mockContractFunctions.getPoliticalActorVotingCycleVoteStartCount.mockImplementationOnce(
      () => Promise.resolve(3)
    );

    await act(async () => {
      ({ container } = render(<CreateNewVotingPage />));
    });

    expect(screen.queryByText('You have no more voting credit left for this voting cycle')).toBeInTheDocument();
  });
});
