import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';
import ConnectionAndModeManager from '@components/connectionAndModeManager/ConnectionAndModeManager';
import { useNavigate } from 'react-router-dom';

const UserActionsMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { userState } = useUserContext();

  const navigate = useNavigate();

  const { showModal } = useModalContext();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton
        size='large'
        edge='end'
        aria-label='account of current user'
        aria-controls='menu-appbar'
        aria-haspopup='true'
        onClick={handleMenu}
        color='inherit'
      >
        <AccountCircleIcon />
        {!isMobile && (
          <Typography marginLeft={1}>({userState.mode})</Typography>
        )}
      </IconButton>
      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {isMobile && (
          <MenuItem onClick={handleClose}>
            <Typography textAlign='center'>Mode: ({userState.mode})</Typography>
          </MenuItem>
        )}
        {/* Add other menu items here */}
        <MenuItem
          onClick={() => {
            showModal(<ConnectionAndModeManager metamaskInstalled />);
            handleClose();
          }}
        >
          Connection/mode
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate('profile');
            handleClose();
          }}
        >
          My account
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserActionsMenu;
