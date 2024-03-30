import * as React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import ToggleThemeButton from '@components/navigationBar/toggleThemeModeButton/ToggleThemeModeButton';
import ChooseMode from '@components/ConnectionAndModeManager/ConnectionAndModeManager';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';

const Header: React.FC = () => {
  const { showModal } = useModalContext();

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' style={{ flexGrow: 1 }}>
          BVS App
        </Typography>
        <Button color='warning' onClick={() => showModal(<ChooseMode />)}>
          Manage connection
        </Button>
        <ToggleThemeButton />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
