import { TimeQuantities } from '@global/constants/general';
import { mockContractFunctions } from '@mocks/contract-mocks';
import {
  act, render, screen
} from 'test-utils';
import OngoingScheduledElectionsPage from './OngoingScheduledElectionsPage';

const mockFutureTimestamp = 2533566483000; // 2050. April 14.

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
      () => Promise.resolve(Math.ceil(mockFutureTimestamp))
    );

    mockContractFunctions.getElectionsEndDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(mockFutureTimestamp + TimeQuantities.MONTH * 1000))
    );

    await act(async () => {
      render(<OngoingScheduledElectionsPage />);
    });

    expect(screen.queryByText('Ongoing & next elections')).toBeInTheDocument();
    expect(screen.queryByText('There is no ongoing or upcoming elections.')).not.toBeInTheDocument();

    expect(screen.queryByText('Elections start: 14/04/2050')).toBeInTheDocument();
    expect(screen.queryByText('Elections end: 14/05/2050')).toBeInTheDocument();
  });
});
