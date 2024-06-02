import { MOCK_CONTACTS, mockContractFunctions } from '@mocks/contract-mocks';
import userEvent from '@testing-library/user-event';
import { act, render, screen } from 'test-utils';
import ContactsPage from './ContactsPage';

jest.mock('@hooks/contract/useContract', () => ({
  __esModule: true,
  default: () => mockContractFunctions
}));

describe('ContactsPage', () => {
  let container: any;

  it('Should exist', () => {
    expect(ContactsPage).toBeDefined();
  });

  describe('Display contacts', () => {
    it('should render expected content and call contract functions', async () => {
      await act(() => {
        ({ container } = render(<ContactsPage />));
      });

      expect(screen.queryByText('Contacts')).toBeInTheDocument();

      expect(mockContractFunctions.getContacts).toHaveBeenCalled();

      // eslint-disable-next-line no-restricted-syntax
      for (const mockContactKey of Object.keys(MOCK_CONTACTS)) {
        const contactValueInput = container.querySelector(`input[name="${mockContactKey}-value"]`);

        expect(screen.queryByText(mockContactKey)).toBeInTheDocument();
        expect(contactValueInput).toHaveValue(MOCK_CONTACTS[mockContactKey]);
      }

      const firstAlreadyExistingContactValueInput = container.querySelector('input[name="test_contact_key_1-value"]');

      await userEvent.clear(firstAlreadyExistingContactValueInput);
      await userEvent.type(firstAlreadyExistingContactValueInput, 'bla bla bla');

      await userEvent.click(screen.getAllByRole('button', { name: 'UPDATE' })[0]);

      expect(mockContractFunctions.updateContactAtKey).toHaveBeenCalledWith(
        'test_contact_key_1',
        'bla bla bla'
      );

      const newContactKeyInput = container.querySelector('input[name="new-contact-key"]');
      const newContactValueInput = container.querySelector('input[name="new-contact-value"]');

      await userEvent.type(newContactKeyInput, 'Citizenship application');
      await userEvent.type(newContactValueInput, 'test444@bvs.com');

      await userEvent.click(screen.getByRole('button', { name: 'CREATE' }));

      expect(mockContractFunctions.updateContactAtKey).toHaveBeenCalledWith(
        'Citizenship application',
        'test444@bvs.com'
      );
    });
  });
});
