import React, { useEffect, useState } from 'react';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import {
  ContractRoleskeccak256,
  USER_MODES,
  UserMode
} from '@global/types/user';

import { Alert, Box, Button, Stack } from '@mui/material';

import { useSDK } from '@metamask/sdk-react';

import { useInfoContext } from '@hooks/context/infoContext/InfoContext';
import useHandleConnectMetamask from '@hooks/metamask/useHandleConnectMetamask';

import MetaMaskOnboarding from '@metamask/onboarding';

type ConnectionAndModeManagerProps = {
  metamaskInstalled: boolean;
};
const ConnectionAndModeManager: React.FC<ConnectionAndModeManagerProps> = ({
  metamaskInstalled
}) => {
  const { alerts } = useInfoContext();

  const { handleConnectMetamask } = useHandleConnectMetamask();

  const { userState, setUserState } = useUserContext();
  const { sdk, connected, connecting, provider: ethereum, chainId } = useSDK();

  const [availableModes, setAvailableModes] = useState([USER_MODES.GUEST]);

  let onboarding: MetaMaskOnboarding;

  React.useEffect(() => {
    const checkAvailableRoles = async () => {
      const checkRole = async (role: string) => {
        const hasRole = await userState.contract?.hasRole(
          role,
          userState.walletAddress || '0x0'
        );
        return hasRole;
      };
      const availableModes = [
        USER_MODES.GUEST,
        ...((await checkRole(ContractRoleskeccak256.CITIZEN))
          ? [USER_MODES.CITIZEN]
          : []),
        ...((await checkRole(ContractRoleskeccak256.POLITICAL_ACTOR))
          ? [USER_MODES.POLITICAL_ACTOR]
          : []),
        ...((await checkRole(ContractRoleskeccak256.ADMINISTRATOR))
          ? [USER_MODES.ADMINISTRATOR]
          : [])
      ];
      setAvailableModes(availableModes);
    };

    if (userState.contract && userState.walletAddress && connected) {
      checkAvailableRoles();
    }
  }, [userState, connected]);

  React.useEffect(() => {
    if (metamaskInstalled) {
      if (window.ethereum) {
        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });
        window.ethereum.on('accountsChanged', (accounts) => {
          setUserState({
            ...userState,
            walletAddress: (accounts as any[])?.[0]
          });
        });
      }
    }
  }, [metamaskInstalled]);

  console.log('metamaskInstalled:', metamaskInstalled);

  const handleInstallMetamask = async () => {
    sdk?.installer?.startDesktopOnboarding();
  };

  const enterAs = (mode: UserMode) => {
    setUserState({ ...userState, mode });
  };

  return (
    <Stack direction='column' spacing={2}>
      {metamaskInstalled ? (
        <Button
          variant='contained'
          onClick={handleConnectMetamask}
          disabled={!!userState.walletAddress}
        >
          {!userState.walletAddress
            ? 'Connect to MetaMask 🦊'
            : 'Connected to metamask 🦊'}
        </Button>
      ) : (
        <Button variant='contained' onClick={handleInstallMetamask}>
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
          <Box fontWeight='bold' display='inline'>
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
          <Box fontWeight='bold' display='inline'>
            Connected account:
          </Box>
          {` ${userState.walletAddress || ''}`}
        </Box>
        <Box>
          <Box fontWeight='bold' display='inline'>
            Current mode:
          </Box>
          {` ${userState.mode?.toUpperCase() || ''}`}
        </Box>
      </Stack>
      Modes you have access:
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.GUEST)}
        disabled={
          !userState.walletAddress || !availableModes.includes(USER_MODES.GUEST)
        }
      >
        Guest
      </Button>
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.CITIZEN)}
        disabled={
          !userState.walletAddress ||
          !availableModes.includes(USER_MODES.CITIZEN)
        }
      >
        Citizen
      </Button>
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.POLITICAL_ACTOR)}
        disabled={
          !userState.walletAddress ||
          !availableModes.includes(USER_MODES.POLITICAL_ACTOR)
        }
      >
        Political actor
      </Button>
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.ADMINISTRATOR)}
        disabled={
          !userState.walletAddress ||
          !availableModes.includes(USER_MODES.ADMINISTRATOR)
        }
      >
        Administrator
      </Button>
    </Stack>
  );
};

export default ConnectionAndModeManager;
