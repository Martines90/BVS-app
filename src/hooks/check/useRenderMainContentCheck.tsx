import ConnectionAndModeManager from '@components/connectionAndModeManager/ConnectionAndModeManager';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import useContract from '@hooks/contract/useContract';

import useHandleConnectMetamask from '@hooks/metamask/useHandleConnectMetamask';
import detectEthereumProvider from '@metamask/detect-provider';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const useRenderMainContentCheck = (): { renderMainContent: boolean } => {
  const { showModal, isVisible } = useModalContext();
  const { userState, setUserState } = useUserContext();
  const { contract } = useContract();
  const { handleConnectMetamask } = useHandleConnectMetamask();

  const navigate = useNavigate();

  const [metamaskInstalledAndConnected, setMetamaskInstalledAndConnected] = React.useState(true);

  const [metamaskInstalled, setMetamaskInstalled] = React.useState(true);

  const [renderMainContent, setRenderMainContent] = React.useState(false);

  const isUserSelectedMode = !!userState.mode;

  // check metamask connection

  React.useEffect(() => {
    const detectEthereumProviderCall = async () => {
      const provider = (await detectEthereumProvider()) as any;

      const accounts = await provider
        ?.request({
          method: 'eth_accounts'
        })
        .then(async (accounts: any) => {
          setMetamaskInstalled(true);
          return accounts;
        })
        .catch((err: any) => {
          console.log('ERRR:', err);
          setMetamaskInstalled(false);
          setMetamaskInstalledAndConnected(false);
        });

      if (!accounts || accounts?.length === 0) {
        setMetamaskInstalledAndConnected(false);
      } else {
        setMetamaskInstalledAndConnected(true);
      }
    };
    detectEthereumProviderCall();
  }, [isVisible]);

  React.useEffect(() => {
    if (metamaskInstalledAndConnected) {
      if (
        window.ethereum
        && !(window.ethereum as any)?._events?.accountsChanged?.length
      ) {
        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });
        window.ethereum.on('accountsChanged', (accounts) => {
          setUserState({
            ...userState,
            mode: undefined,
            walletAddress: (accounts as any[])?.[0]
          });

          navigate(0);
        });
      }
    }
  }, [metamaskInstalledAndConnected]);

  React.useEffect(() => {
    const callHandleConnectMetamask = async () => {
      let suceeded = false;

      if (metamaskInstalledAndConnected) {
        console.log('call connect to metamask');
        suceeded = await handleConnectMetamask();
      }

      if (!suceeded || !userState.mode) {
        showModal(
          <ConnectionAndModeManager metamaskInstalled={metamaskInstalled} />
        );
        setRenderMainContent(false);
      } else {
        setRenderMainContent(true);
      }
    };

    if (
      (!metamaskInstalledAndConnected && !isVisible)
      || (metamaskInstalledAndConnected
        && !isVisible
        && (!contract || !userState.walletAddress || !isUserSelectedMode))
    ) {
      callHandleConnectMetamask();
    }
  }, [isVisible, metamaskInstalledAndConnected]);

  React.useEffect(() => {
    if (
      contract
      && userState.walletAddress
      && isUserSelectedMode
      && !renderMainContent
    ) {
      setRenderMainContent(true);
    }
  }, [userState]);

  return {
    renderMainContent
  };
};

export default useRenderMainContentCheck;
