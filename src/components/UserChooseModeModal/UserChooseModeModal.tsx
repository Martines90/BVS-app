import React, { useEffect, useState } from 'react';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import {
  ContractRoleskeccak256,
  USER_MODES,
  UserMode
} from '@global/types/user';
import { getUserMode } from '@global/selectors/user';
import { Box, Button, Stack, Typography } from '@mui/material';

import { useSDK } from '@metamask/sdk-react';
import MetaMaskOnboarding from '@metamask/onboarding';

import connectToContract from '@hooks/contract/connectToContract';
import { Bytes } from '@metamask/utils';

const UserChooseModeModal: React.FC = () => {
  const [metamaskInstalled, setMetamaskInstalled] = useState(
    MetaMaskOnboarding.isMetaMaskInstalled()
  );
  const onboarding = React.useRef<any>();

  const { userState, setUserState } = useUserContext();
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const userMode = getUserMode(userState);

  const [availableModes, setAvailableModes] = useState([USER_MODES.GUEST]);

  React.useEffect(() => {
    const checkAvailableRoles = async () => {
      const checkRole = async (role: string) =>
        await userState.contract?.hasRole(
          role,
          userState.walletAddress || '0x0'
        );
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

    if (userState.contract && userState.walletAddress) {
      checkAvailableRoles();
    }
  }, [userState]);

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }

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
  }, []);

  const handleConnectMetamask = async () => {
    try {
      const account = ((await sdk?.connect()) as any[])?.[0];

      const chainId = (await provider?.request({
        method: 'eth_chainId'
      })) as Bytes;

      const contract = await connectToContract(provider);

      console.log('account:', account, 'contract:', contract);

      setUserState({
        ...userState,
        walletAddress: account,
        contract,
        chainId
      });
    } catch (err) {
      console.warn('failed to connect..', err);
    }
  };

  const handleInstallMetamask = async () => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      onboarding.current.startOnboarding();
    }
  };

  const enterAs = (mode: UserMode) => {
    setUserState({ ...userState, mode });
  };

  console.log(
    'connecting:',
    connecting,
    'connected:',
    connected,
    'userState:',
    userState
  );

  useEffect(() => {
    const callHandleConnectMetamask = async () => {
      await handleConnectMetamask();
    };
    if (
      !connecting &&
      connected &&
      (!userState.contract || !userState.walletAddress)
    ) {
      callHandleConnectMetamask();
    }
  }, [connecting, connected]);

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
      <Typography>
        <Stack>
          <Typography>
            <Box fontWeight='bold' display='inline'>
              Connected chain:
            </Box>
            {` ${userState.chainId || ''}`}
          </Typography>
          <Typography>
            <Box fontWeight='bold' display='inline'>
              Connected account:
            </Box>
            {` ${userState.walletAddress || ''}`}
          </Typography>
          <Typography>
            <Box fontWeight='bold' display='inline'>
              Current mode:
            </Box>
            {` ${userState.mode || ''}`}
          </Typography>
        </Stack>
      </Typography>
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

export default UserChooseModeModal;
