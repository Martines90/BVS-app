import * as React from 'react';
import { Box } from '@mui/material';
import { MainProps } from './types';
import useRenderMainContentCheck from '@hooks/check/useRenderMainContentCheck';

const Main: React.FC<MainProps> = ({ children }) => {
  const { renderMainContent } = useRenderMainContentCheck();

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
