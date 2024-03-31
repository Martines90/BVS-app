import * as React from 'react';
import { Box } from '@mui/material';
import { MainProps } from './types';

import ConnectionAndModeManager from '@components/connectionAndModeManager/ConnectionAndModeManager';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';
import { useUserContext } from '@hooks/context/userContext/UserContext';

import useHandleConnectMetamask from '@hooks/metamask/useHandleConnectMetamask';
import detectEthereumProvider from '@metamask/detect-provider';

const Main: React.FC<MainProps> = ({ children }) => {
  const { showModal, hideModal, isVisible } = useModalContext();
  const { userState } = useUserContext();
  const { handleConnectMetamask } = useHandleConnectMetamask();

  const [metamaskInstalledAndConnected, setMetamaskInstalledAndConnected] =
    React.useState(true);

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
        .then((accounts: any) => {
          console.log('load accounts');
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
    const callHandleConnectMetamask = async () => {
      let suceeded = false;
      console.log(
        'metamaskInstalledAndConnected',
        metamaskInstalledAndConnected
      );
      if (metamaskInstalledAndConnected) {
        suceeded = await handleConnectMetamask();
      }

      console.log('suceeded:', suceeded);

      if (!suceeded) {
        showModal(
          <ConnectionAndModeManager metamaskInstalled={metamaskInstalled} />
        );
        setRenderMainContent(false);
      } else {
        setRenderMainContent(true);
      }
    };

    if (
      !metamaskInstalledAndConnected &&
      !isVisible &&
      (!userState.contract || !userState.walletAddress || !isUserSelectedMode)
    ) {
      callHandleConnectMetamask();
    }
  }, [isVisible, metamaskInstalledAndConnected]);

  if (!renderMainContent) {
    return null;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {children}
    </Box>
  );
};

export default Main;
