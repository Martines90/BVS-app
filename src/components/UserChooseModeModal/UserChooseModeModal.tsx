import React from 'react';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { USER_MODES, UserMode } from '@global/types/user';
import { getUserMode } from '@global/selectors/user';
import { Button, Stack } from '@mui/material';

const UserChooseModeModal: React.FC = () => {
  const { userState, setUserState } = useUserContext();

  const userMode = getUserMode(userState);

  const handleConnectMetamask = () => {
    // Logic to connect to Metamask
  };

  const enterAs = (mode: UserMode) => {
    setUserState({ ...userState, mode });
  };

  return (
    <Stack direction='column' spacing={2}>
      <Button
        variant='contained'
        onClick={handleConnectMetamask}
        disabled={!!userMode}
      >
        Connect to MetaMask
      </Button>
      Enter as:
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.GUEST)}
        disabled={!userMode}
      >
        Guest
      </Button>
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.CITIZEN)}
        disabled={!userMode}
      >
        Citizen
      </Button>
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.POLITICAL_ACTOR)}
        disabled={!userMode}
      >
        Political actor
      </Button>
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.ADMINISTRATOR)}
        disabled={!userMode}
      >
        Administrator
      </Button>
    </Stack>
  );
};

export default UserChooseModeModal;
