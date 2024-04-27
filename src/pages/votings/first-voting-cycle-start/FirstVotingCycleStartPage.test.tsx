import { mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from 'test-utils';
import FirstVotingCycleStartPage from './FirstVotingCycleStartPage';

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

describe('CreateNewVotingTable', () => {
  it('Should exist', () => {
    expect(FirstVotingCycleStartPage).toBeDefined();
  });

  it('should render default view', async () => {
    await act(async () => {
      render(<FirstVotingCycleStartPage />);
    });

    expect(mockContractFunctions.getFirstVotingCycleStartDate).toHaveBeenCalled();

    expect(screen.queryByText('First voting cycle')).toBeInTheDocument();
    expect(screen.queryByText('Not yet set')).toBeInTheDocument();

    const startDateInput = screen.getByTestId('start-date');

    await userEvent.click(startDateInput);

    await userEvent.click(screen.getByText('25'));

    expect(screen.getByDisplayValue('25/04/2024')).toHaveAttribute('name', 'start-date-field');

    await userEvent.click(screen.getByRole('button', { name: 'SET FIRST VOTING CYCLE START DATE' }));

    expect(mockContractFunctions.setFirstVotingCycleStartDate).toHaveBeenCalledWith(1713996000);
  });

  it('should render view when voting cycle already picked', async () => {
    mockContractFunctions.getFirstVotingCycleStartDate.mockImplementationOnce(
      () => Promise.resolve(mockNowTimestamp)
    );

    await act(async () => {
      render(<FirstVotingCycleStartPage />);
    });

    expect(screen.queryByText('18/04/2024 21:18')).toBeInTheDocument();
  });
});
