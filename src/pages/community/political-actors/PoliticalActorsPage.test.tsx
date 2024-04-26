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

    for (let i = 0; i < mockAccountPublicKeys.length; i++) {
      expect(screen.queryByText(mockAccountPublicKeys[i])).toBeInTheDocument();
    }
  });
});
