import React, { useEffect, useState } from 'react';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import {
  ContractRoleskeccak256,
  USER_MODES,
  UserMode
} from '@global/types/user';

import { Box, Button, Stack, Typography } from '@mui/material';

import { useSDK } from '@metamask/sdk-react';
import detectEthereumProvider from '@metamask/detect-provider';

import connectToContract from '@hooks/contract/connectToContract';
import { Bytes } from '@metamask/utils';

const UserChooseModeModal: React.FC = () => {
  const [metamaskInstalled, setMetamaskInstalled] = useState(true);

  const { userState, setUserState } = useUserContext();
  const { sdk, connected, connecting, provider: ethereum, chainId } = useSDK();

  const [availableModes, setAvailableModes] = useState([USER_MODES.GUEST]);

  useEffect(() => {
    detectEthereumProvider().then(async (provider) => {
      if (provider && provider.isMetaMask) {
        await ethereum
          ?.request({ method: 'eth_accounts' })
          .then((accounts: any) => {
            if (accounts.length === 0) {
            } else {
              //  handleConnectMetamask();
            }
          })
          .catch(console.error);
      } else {
        setMetamaskInstalled(false);
      }
    });
  }, []);

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

      const chainId = (await ethereum?.request({
        method: 'eth_chainId'
      })) as Bytes;

      const contract = await connectToContract(ethereum);

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
    sdk?.installer?.startDesktopOnboarding();
  };

  const enterAs = (mode: UserMode) => {
    setUserState({ ...userState, mode });
  };

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
