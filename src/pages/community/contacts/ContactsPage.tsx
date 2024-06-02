import Label from '@components/general/Label/Label';
import SubTitle from '@components/general/SubTitle/SubTitle';
import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import { showSuccessToast } from '@components/toasts/Toasts';
import { USER_MODES } from '@global/types/user';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Box, Button, Stack, TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

const labelCssSettings = {
  minWidth: '110px'
};

type Contact = {
  key?: string,
  value?: string
};

const ContactsPage = () => {
  const { getContacts, updateContactAtKey } = useContract();
  const { userState } = useUserContext();
  const [contacts, setContacts] = useState<{ [key: string]: string }>({});
  const [newContact, setNewContact] = useState<Contact>({});

  useEffect(() => {
    const renderContacts = async () => {
      const _contacts = await asyncErrWrapper(getContacts)() || {};
      setContacts(_contacts);
    };

    renderContacts();
  }, []);

  const updateContactAtKeyAction = async (key: string) => {
    asyncErrWrapper(updateContactAtKey)(key, contacts[key]).then(() => {
      showSuccessToast(` contact at ${key} key successfully updated`);
    });
  };

  const addNewContact = async () => {
    asyncErrWrapper(updateContactAtKey)(
      newContact.key || '',
      newContact.value || ''
    ).then(() => {
      showSuccessToast(` contact at ${newContact.key} key successfully created`);
    });
  };

  const isAdmin = userState.mode === USER_MODES.ADMINISTRATOR;

  return (
    <PageContainer>
      <PageTitle>
        Contacts
      </PageTitle>
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {isAdmin && (
          <Stack spacing={2}>
            <SubTitle text="Add new contact" />
            <Stack direction="row" spacing={2}>
              <Label text="New contact:" css={labelCssSettings} />
              <TextField
                label="Contact key"
                placeholder="Contact key"
                name="new-contact-key"
                fullWidth
                value={newContact.key || ''}
                onChange={
                (e) => {
                  setNewContact({
                    ...newContact,
                    key: e.target.value
                  });
                }
              }
              />
              <TextField
                label="Contact value"
                placeholder="Contact value"
                name="new-contact-value"
                fullWidth
                value={newContact.value || ''}
                onChange={
                (e) => {
                  setNewContact({
                    ...newContact,
                    value: e.target.value
                  });
                }
              }
              />
              <Button
                sx={{ width: '160px' }}
                variant="contained"
                onClick={addNewContact}
              >
                CREATE
              </Button>
            </Stack>
          </Stack>
          )}
          <SubTitle text="Contacts" />
          {Object.keys(contacts).length === 0
            && <Typography>No contacts added yet</Typography>}
          {Object.keys(contacts).map((key) => (
            <Stack key={key} direction="row" spacing={2}>
              <Label text={key} css={labelCssSettings} />
              <TextField
                disabled={!isAdmin}
                label="Contact value"
                placeholder="Contact value"
                name={`${key}-value`}
                fullWidth
                value={contacts[key] || ''}
                onChange={
                  (e) => {
                    setContacts({
                      ...contacts,
                      [key]: e.target.value
                    });
                  }
                }
              />
              {isAdmin
              && (
              <Button
                sx={{ width: '160px' }}
                variant="contained"
                onClick={() => updateContactAtKeyAction(key)}
              >
                UPDATE
              </Button>
              )}
            </Stack>
          ))}
        </Stack>
      </Box>
    </PageContainer>
  );
};

export default ContactsPage;
