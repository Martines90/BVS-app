import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import ToggleThemeButton from '@components/navigationBar/toggleThemeModeButton/ToggleThemeModeButton';

const Header: React.FC = () => (
  <AppBar position='static'>
    <Toolbar>
      <Typography variant='h6' style={{ flexGrow: 1 }}>
        BVS App
      </Typography>
      <ToggleThemeButton />
    </Toolbar>
  </AppBar>
);

export default Header;
