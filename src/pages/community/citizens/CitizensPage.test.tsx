import { TABLE_DISPLAY_MAX_ROWS } from '@global/constants/general';
import { mockAccountPublicKeys, mockContractFunctions } from '@mocks/contract-mocks';
import { act, render, screen } from 'test-utils';
import CitizensPage from './CitizensPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('CitizensTable', () => {
  it('Should exist', () => {
    expect(CitizensPage).toBeDefined();
  });

  it('should render citizens', async () => {
    await act(async () => {
      render(<CitizensPage />);
    });

    expect(screen.queryByText('Citizens')).toBeInTheDocument();
    expect(screen.queryByText('Total number of citizens:')).toBeInTheDocument();
    expect(screen.queryByText('11')).toBeInTheDocument();

    for (let i = 0; i < TABLE_DISPLAY_MAX_ROWS; i++) {
      expect(screen.queryByText(mockAccountPublicKeys[i])).toBeInTheDocument();
    }
  });
});
