import { mockContractFunctions } from '@mocks/contract-mocks';
import { act, render, screen } from 'test-utils';
import CreateNewVotingPage from './CreateNewVotingPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('CreateNewVotingTable', () => {
  it('Should exist', () => {
    expect(CreateNewVotingPage).toBeDefined();
  });

  it('should render new default view', async () => {
    await act(async () => {
      render(<CreateNewVotingPage />);
    });

    expect(screen.queryByText('Create new voting')).toBeInTheDocument();
  });
});
