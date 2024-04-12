import ToggleThemeButton from '@components/navigationBar/toggleThemeModeButton/ToggleThemeModeButton';
import UserActionsMenu from '@components/navigationBar/userActionsMenu/UserActionsMenu';
import { AppBar, Toolbar } from '@mui/material';
import * as React from 'react';

const Header: React.FC = () => (
  <AppBar position="static">
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

export default Header;
