import { TABLE_DISPLAY_MAX_ROWS } from '@global/constants/general';
import { mockAccountPublicKeys, mockContractFunctions } from '@mocks/contract-mocks';
import { act, render, screen } from 'test-utils';
import PoliticalActorsPage from './PoliticalActorsPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('CitizensTable', () => {
  it('Should exist', () => {
    expect(PoliticalActorsPage).toBeDefined();
  });

  it('should render citizens', async () => {
    await act(async () => {
      render(<PoliticalActorsPage />);
    });

    expect(screen.queryByText('Political actors')).toBeInTheDocument();
    expect(screen.queryByText('Total number of political actors:')).toBeInTheDocument();
    expect(screen.queryByText('11')).toBeInTheDocument();

    for (let i = 0; i < TABLE_DISPLAY_MAX_ROWS; i++) {
      expect(screen.queryByText(mockAccountPublicKeys[i])).toBeInTheDocument();
    }
  });
});
