import { Dispatch, SetStateAction } from 'react';
import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import menuItems from './menuItems';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SIDEBAR_NAV_DIMENSIONS } from '@global/constants/page';

const SideNavigationBar = ({
  setIsLeftNaveOpen,
  isLeftNaveOpen
}: {
  setIsLeftNaveOpen: Dispatch<SetStateAction<boolean>>;
  isLeftNaveOpen: boolean;
}) => {
  const navigate = useNavigate();

  const handleDrawer = () => {
    setIsLeftNaveOpen(!isLeftNaveOpen);
  };

  const iconTextStyle = {
    icons: {
      color: 'rgba(255, 255, 255, 0.7)!important',
      minWidth: isLeftNaveOpen ? '56px' : '35px',
      marginLeft: isLeftNaveOpen ? '20px' : '0px'
    },
    chevronIcon: {
      color: 'rgba(255, 255, 255, 0.7)!important'
    },
    text: {
      '& span': {
        marginLeft: '-10px',
        fontWeight: '600',
        fontSize: '16px'
      }
    }
  };

  return (
    <Drawer
      variant='permanent'
      open={isLeftNaveOpen}
      sx={{
        width: isLeftNaveOpen
          ? SIDEBAR_NAV_DIMENSIONS.widthOpen
          : SIDEBAR_NAV_DIMENSIONS.widthClosed,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isLeftNaveOpen
            ? SIDEBAR_NAV_DIMENSIONS.widthOpen
            : SIDEBAR_NAV_DIMENSIONS.widthClosed,
          backgroundColor: '#101F33',
          color: 'rgba(255, 255, 255, 0.7)',
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen
            })
        }
      }}
    >
      <List
        sx={{
          display: 'flex',
          flexFlow: 'row nowrap',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: (theme) => theme.spacing(1),
          margin: 0
        }}
      >
        <ListItem sx={{ padding: 0, margin: 0 }}>BVS</ListItem>
        <ListItem sx={{ padding: 0, margin: 0, justifyContent: 'end' }}>
          <IconButton onClick={handleDrawer}>
            {isLeftNaveOpen ? (
              <ChevronLeftIcon sx={iconTextStyle.chevronIcon} />
            ) : (
              <ChevronRightIcon sx={iconTextStyle.chevronIcon} />
            )}
          </IconButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <List>
          {menuItems.map(({ label, icon }, index) => (
            <ListItem
              button
              key={label}
              sx={{
                display: 'flex',
                justifyContent: isLeftNaveOpen ? 'initial' : 'center'
              }}
            >
              <ListItemIcon sx={iconTextStyle.icons}>{icon}</ListItemIcon>
              <ListItemText
                sx={{
                  ...iconTextStyle.text,
                  ...{ display: isLeftNaveOpen ? 'block' : 'none' }
                }}
                primary={label}
              />
            </ListItem>
          ))}
        </List>
      </List>
    </Drawer>
  );
};

export default SideNavigationBar;
