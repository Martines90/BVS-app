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

    for (let i = 0; i < mockAccountPublicKeys.length; i++) {
      expect(screen.queryByText(mockAccountPublicKeys[i])).toBeInTheDocument();
    }
  });
});
