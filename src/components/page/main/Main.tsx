import * as React from 'react';
import { Box } from '@mui/material';
import { MainProps } from './types';

const Main: React.FC<MainProps> = ({ children }) => (
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

export default Main;
