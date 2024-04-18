/*
getElectionStartEndIntervalInDays,
    isThereOngoingElections: _isThereOngoingElections,
    scheduleNextElections
*/

import { mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import {
  act, render, screen
} from 'test-utils';
import ScheduleNextElectionsPage from './ScheduleNextElectionsPage';

const mockNowTimestamp = 1713467901248; // 2024. April 18., Thursday 19:18:21.248

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

jest.mock('@global/helpers/date', () => ({
  getNow: () => mockNowTimestamp
}));

jest.mock('@components/links/LinkInText', () => ({ children }: { children: any }) => <div>{children}</div>);

describe('ScheduleNextElectionsPage', () => {
  it('Should exist', () => {
    expect(ScheduleNextElectionsPage).toBeDefined();
  });

  describe('elections not yet scheduled', () => {
    it('should display properly date pickers enabled / disabled state', async () => {
      await act(async () => {
        render(<ScheduleNextElectionsPage />);
      });

      expect(mockContractFunctions.getElectionStartEndIntervalInDays).toHaveBeenCalled();
      expect(mockContractFunctions.isThereOngoingElections).toHaveBeenCalled();

      expect(
        screen.queryByText('Schedule Next Elections')
      ).toBeInTheDocument();

      const startDateInput = screen.getByTestId('start-date');

      await userEvent.click(startDateInput);

      await userEvent.click(screen.getByText('25'));

      expect(screen.getByDisplayValue('25/05/2024')).toHaveAttribute('name', 'start-date-field');

      const endDateInput = screen.getByTestId('end-date');

      await userEvent.click(endDateInput);

      await userEvent.click(screen.getByText('28'));

      expect(screen.getByDisplayValue('28/06/2024')).toHaveAttribute('name', 'end-date-field');

      await userEvent.click(screen.getByRole('button', { name: 'SCHEDULE ELECTION' }));

      expect(mockContractFunctions.scheduleNextElections).toHaveBeenCalled();

      expect(screen.queryByText('There is an already scheduled or ongoing election!', { exact: false })).toBeInTheDocument();
      expect(screen.queryByText('Check out elections', { exact: false })).toBeInTheDocument();
    });
  });
});
