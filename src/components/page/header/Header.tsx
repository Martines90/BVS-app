import * as React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import ToggleThemeButton from '@components/navigationBar/toggleThemeModeButton/ToggleThemeModeButton';
import UserChooseModeModal from '@components/UserChooseModeModal/UserChooseModeModal';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';

const Header: React.FC = () => {
  const { showModal } = useModalContext();

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' style={{ flexGrow: 1 }}>
          BVS App
        </Typography>
        <Button
          color='warning'
          onClick={() => showModal(<UserChooseModeModal />)}
        >
          Manage connection
        </Button>
        <ToggleThemeButton />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
