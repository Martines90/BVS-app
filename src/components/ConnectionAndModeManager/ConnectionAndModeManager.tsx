import {
  USER_MODES,
  USER_ROLES,
  UserMode
} from '@global/types/user';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import React, { useEffect, useState } from 'react';

import {
  Alert, Box, Button, Stack
} from '@mui/material';

import { useSDK } from '@metamask/sdk-react';

import { useInfoContext } from '@hooks/context/infoContext/InfoContext';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import useHandleConnectMetamask from '@hooks/metamask/useHandleConnectMetamask';

type ConnectionAndModeManagerProps = {
  metamaskInstalled: boolean;
};

const ConnectionAndModeManager: React.FC<ConnectionAndModeManagerProps> = ({
  metamaskInstalled
}) => {
  const { alerts } = useInfoContext();
  const { hasRole, contract } = useContract();

  const { handleConnectMetamask } = useHandleConnectMetamask();

  const { userState, setUserState } = useUserContext();
  const [connected, setConnected] = useState(false);
  const {
    sdk
  } = useSDK();

  const [availableModes, setAvailableModes] = useState([USER_MODES.GUEST]);

  React.useEffect(() => {
    const checkAvailableRoles = async () => {
      const checkRole = async (role: USER_ROLES) => {
        const _hasRole = userState.walletAddress
          && (await asyncErrWrapper(hasRole)(role, userState.walletAddress));
        console.log('role:', role, '_hasRole:', _hasRole);
        return _hasRole;
      };
      const _availableModes = [
        USER_MODES.GUEST,
        ...((await checkRole(USER_ROLES.CITIZEN))
          ? [USER_MODES.CITIZEN]
          : []),
        ...((await checkRole(USER_ROLES.POLITICAL_ACTOR))
          ? [USER_MODES.POLITICAL_ACTOR]
          : []),
        ...((await checkRole(USER_ROLES.ADMINISTRATOR))
          ? [USER_MODES.ADMINISTRATOR]
          : [])
      ];
      setAvailableModes(_availableModes);
    };

    if (contract && userState.walletAddress && connected) {
      checkAvailableRoles();
    }
  }, [userState, connected]);

  useEffect(() => {
    const checkConnection = async () => {
      window.ethereum?.request({ method: 'eth_accounts' }).then((accounts: any) => {
        if (accounts.length > 0 && accounts[0] === userState.walletAddress) {
          setConnected(true);
        } else {
          setConnected(false);
        }
      }).catch(console.error);
    };

    if (userState.walletAddress) {
      checkConnection();
    }
  }, [userState]);

  const handleInstallMetamask = async () => {
    sdk?.installer?.startDesktopOnboarding();
  };

  const enterAs = (mode: UserMode) => {
    setUserState({ ...userState, mode });
  };

  return (
    <Box sx={{ p: '10px' }}>
      <Stack direction="column" spacing={2}>
        {metamaskInstalled ? (
          <Button
            variant="contained"
            onClick={handleConnectMetamask}
            disabled={!!userState.walletAddress}
          >
            {!userState.walletAddress
              ? 'Connect to MetaMask 🦊'
              : 'Connected to metamask 🦊'}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleInstallMetamask}>
            Click here to install MetaMask 🦊!
          </Button>
        )}
        <Stack>
          {alerts.failedContractConnection && (
          <Alert severity={alerts.failedContractConnection.severity}>
            {alerts.failedContractConnection.text}
          </Alert>
          )}
          <Box>
            <Box fontWeight="bold" display="inline">
              Connected chain:
            </Box>
            {` ${userState.chainId || ''}`}
          </Box>
          {alerts.incorrectChainId && (
          <Alert severity={alerts.incorrectChainId.severity}>
            {alerts.incorrectChainId.text}
          </Alert>
          )}
          <Box>
            <Box fontWeight="bold" display="inline">
              Connected account:
            </Box>
            {` ${userState.walletAddress || ''}`}
          </Box>
          <Box>
            <Box fontWeight="bold" display="inline">
              Current mode:
            </Box>
            {` ${userState.mode?.toUpperCase() || ''}`}
          </Box>
        </Stack>
        Modes you have access:
        <Button
          variant="contained"
          onClick={() => enterAs(USER_MODES.GUEST)}
          disabled={
          !userState.walletAddress || !availableModes.includes(USER_MODES.GUEST)
        }
        >
          Guest
        </Button>
        <Button
          variant="contained"
          onClick={() => enterAs(USER_MODES.CITIZEN)}
          disabled={
          !userState.walletAddress
          || !availableModes.includes(USER_MODES.CITIZEN)
        }
        >
          Citizen
        </Button>
        <Button
          variant="contained"
          onClick={() => enterAs(USER_MODES.POLITICAL_ACTOR)}
          disabled={
          !userState.walletAddress
          || !availableModes.includes(USER_MODES.POLITICAL_ACTOR)
        }
        >
          Political actor
        </Button>
        <Button
          variant="contained"
          onClick={() => enterAs(USER_MODES.ADMINISTRATOR)}
          disabled={
          !userState.walletAddress
          || !availableModes.includes(USER_MODES.ADMINISTRATOR)
        }
        >
          Administrator
        </Button>
      </Stack>
    </Box>
  );
};

export default ConnectionAndModeManager;
