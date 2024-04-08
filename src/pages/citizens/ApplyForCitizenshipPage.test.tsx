import { render, screen } from 'test-utils';
import ApplyForCitizenshipPage from './ApplyForCitizenshipPage';

test('loads and displays greeting', async () => {
  // ARRANGE
  render(<ApplyForCitizenshipPage />);

  expect(
    screen.queryByText('Citizenship Application Board')
  ).toBeInTheDocument();
});
