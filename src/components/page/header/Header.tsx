import * as React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import ToggleThemeButton from '@components/navigationBar/toggleThemeModeButton/ToggleThemeModeButton';
import UserActionsMenu from '@components/navigationBar/userActionsMenu/UserActionsMenu';

const Header: React.FC = () => {
  return (
    <AppBar position='static'>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'right'
        }}
      >
        <UserActionsMenu />
        <ToggleThemeButton />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
