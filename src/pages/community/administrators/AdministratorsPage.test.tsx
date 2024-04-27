import { TABLE_DISPLAY_MAX_ROWS } from '@global/constants/general';
import { mockAccountPublicKeys, mockContractFunctions } from '@mocks/contract-mocks';
import { act, render, screen } from 'test-utils';
import AdministratorsPage from './AdministratorsPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('AdministratorsTable', () => {
  it('Should exist', () => {
    expect(AdministratorsPage).toBeDefined();
  });

  it('should render administrators', async () => {
    await act(async () => {
      render(<AdministratorsPage />);
    });

    expect(screen.queryByText('Administrators')).toBeInTheDocument();
    expect(screen.queryByText('Total number of administrators:')).toBeInTheDocument();
    expect(screen.queryByText('11')).toBeInTheDocument();

    for (let i = 0; i < TABLE_DISPLAY_MAX_ROWS; i++) {
      expect(screen.queryByText(mockAccountPublicKeys[i])).toBeInTheDocument();
    }
  });
});
