import React, { useState } from 'react';
import Modal from '@components/general/Modal/Modal';
import { MetamaskContextWrapperProps } from './types';
import { MetaMaskProvider } from '@metamask/sdk-react';

const MetamaskContextWrapper: React.FC<MetamaskContextWrapperProps> = ({
  children
}) => {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: 'Example React Dapp',
          url: window.location.href
        }
        // Other options
      }}
    >
      {children}
    </MetaMaskProvider>
  );
};

export default MetamaskContextWrapper;