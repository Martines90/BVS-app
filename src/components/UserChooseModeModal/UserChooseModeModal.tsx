import React, { useEffect, useState } from 'react';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { USER_MODES, UserMode } from '@global/types/user';
import { getUserMode } from '@global/selectors/user';
import { Button, Stack, Typography } from '@mui/material';

import { useSDK } from '@metamask/sdk-react';
import MetaMaskOnboarding from '@metamask/onboarding';

import connectToContract from '@hooks/contract/connectToContract';

const UserChooseModeModal: React.FC = () => {
  const [metamaskInstalled, setMetamaskInstalled] = useState(
    MetaMaskOnboarding.isMetaMaskInstalled()
  );
  const onboarding = React.useRef<any>();

  const { userState, setUserState } = useUserContext();
  const { sdk, connected, connecting, provider, chainId } = useSDK();
  const userMode = getUserMode(userState);

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  const handleConnectMetamask = async () => {
    try {
      const account = ((await sdk?.connect()) as any[])?.[0];

      const contract = await connectToContract(account);

      console.log('account:', account, 'contract:', contract);

      setUserState({ ...userState, metaAccount: account, contract });
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
    console.log('setUserState');
    setUserState({ ...userState, mode });
  };

  console.log('userState:', userState);

  useEffect(() => {
    const callHandleConnectMetamask = async () => {
      const data = await handleConnectMetamask();
    };
    if (
      !connecting &&
      connected &&
      (!userState.contract || !userState.metaAccount)
    ) {
      console.log('handleConnectMetamask');
      callHandleConnectMetamask();
    }
  }, [connecting, connected]);

  return (
    <Stack direction='column' spacing={2}>
      {metamaskInstalled ? (
        <Button
          variant='contained'
          onClick={handleConnectMetamask}
          disabled={!!connected}
        >
          {!connected ? 'Connect to MetaMask' : 'Connected to metamask'}
        </Button>
      ) : (
        <Button variant='contained' onClick={handleInstallMetamask}>
          Click here to install MetaMask!
        </Button>
      )}
      {connected && (
        <div>
          {chainId && `Connected chain: ${chainId}`}
          <p></p>
          {userState.metaAccount &&
            `Connected account: ${userState.metaAccount}`}
        </div>
      )}
      Enter as:
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.GUEST)}
        disabled={!connected}
      >
        Guest
      </Button>
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.CITIZEN)}
        disabled={!connected}
      >
        Citizen
      </Button>
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.POLITICAL_ACTOR)}
        disabled={!connected}
      >
        Political actor
      </Button>
      <Button
        variant='contained'
        onClick={() => enterAs(USER_MODES.ADMINISTRATOR)}
        disabled={!connected}
      >
        Administrator
      </Button>
    </Stack>
  );
};

export default UserChooseModeModal;
