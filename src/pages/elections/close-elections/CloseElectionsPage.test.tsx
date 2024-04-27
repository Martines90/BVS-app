import { TimeQuantities } from '@global/constants/general';
import { MOCK_FUTURE_TIMESTAMP } from '@mocks/common-mocks';
import { mockContractFunctions } from '@mocks/contract-mocks';
import { act, render, screen } from 'test-utils';
import CloseElectionsPage from './CloseElectionsPage';

import * as dateHelpers from '@global/helpers/date';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('CloseElectionsPage', () => {
  it('Should exist', () => {
    expect(CloseElectionsPage).toBeDefined();
  });

  it('should render no ongoing elections state', async () => {
    await act(async () => {
      render(<CloseElectionsPage />);
    });

    expect(screen.queryByText('Close elections')).toBeInTheDocument();
    expect(screen.queryByText('There are no ongoing elections')).toBeInTheDocument();
  });

  it('should render elections are in progress state', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => MOCK_FUTURE_TIMESTAMP + TimeQuantities.DAY * 1000);

    mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP))
    );

    mockContractFunctions.getElectionsEndDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP + TimeQuantities.MONTH * 1000))
    );

    await act(async () => {
      render(<CloseElectionsPage />);
    });

    expect(screen.queryByText('Elections still in progress')).toBeInTheDocument();

    expect(screen.queryByText('Elections start:')).toBeInTheDocument();
    expect(screen.queryByText('14/04/2050')).toBeInTheDocument();
    expect(screen.queryByText('Elections end:')).toBeInTheDocument();
    expect(screen.queryByText('14/05/2050')).toBeInTheDocument();
  });

  it('should render elections period end passed and no 7 days passed yet state', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => MOCK_FUTURE_TIMESTAMP + (TimeQuantities.MONTH + TimeQuantities.DAY) * 1000);

    mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP))
    );

    mockContractFunctions.getElectionsEndDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP + TimeQuantities.MONTH * 1000))
    );

    await act(async () => {
      render(<CloseElectionsPage />);
    });

    expect(screen.queryByText('Elections voting period finished on 14/05/2050 18:28')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Close Elections' })).not.toBeInTheDocument();

    expect(screen.queryByText('Elections can be officially closed after 21/05/2050 18:28')).toBeInTheDocument();
  });

  it('should render elections period end passed and 7 days passed state', async () => {
    jest.spyOn(dateHelpers, 'getNow').mockImplementation(() => MOCK_FUTURE_TIMESTAMP + (TimeQuantities.MONTH + TimeQuantities.WEEK + TimeQuantities.DAY) * 1000);

    mockContractFunctions.getElectionsStartDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP))
    );

    mockContractFunctions.getElectionsEndDate.mockImplementationOnce(
      () => Promise.resolve(Math.ceil(MOCK_FUTURE_TIMESTAMP + TimeQuantities.MONTH * 1000))
    );

    await act(async () => {
      render(<CloseElectionsPage />);
    });

    expect(screen.queryByText('Elections voting period finished on 14/05/2050 18:28')).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Close Elections' })).toBeInTheDocument();
  });
});
