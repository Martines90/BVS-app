import * as React from 'react';
import { Box } from '@mui/material';
import { MainProps } from './types';

import UserChooseModeModal from '@components/UserChooseModeModal/UserChooseModeModal';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { useSDK } from '@metamask/sdk-react';
import useHandleConnectMetamask from '@hooks/metamask/useHandleConnectMetamask';

const Main: React.FC<MainProps> = ({ children }) => {
  const { showModal, hideModal, isVisible } = useModalContext();
  const { userState } = useUserContext();
  const { handleConnectMetamask } = useHandleConnectMetamask();

  const [renderMainContent, setRenderMainContent] = React.useState(false);

  const { sdk, connected, connecting, provider: ethereum, chainId } = useSDK();

  const isUserSelectedMode = !!userState.mode;

  // check metamask connection

  React.useEffect(() => {
    const callHandleConnectMetamask = async () => {
      const suceeded = await handleConnectMetamask();

      if ((!isUserSelectedMode || !suceeded) && !isVisible) {
        console.log('show modal:', connected);
        showModal(<UserChooseModeModal />);
        setRenderMainContent(false);
      } else {
        if (isVisible) {
          hideModal();
        }
        setRenderMainContent(true);
      }
    };
    if (
      !connecting &&
      connected &&
      (!userState.contract || !userState.walletAddress)
    ) {
      callHandleConnectMetamask();
    }
  }, [connecting, connected]);

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
