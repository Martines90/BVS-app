import Drawer from '@mui/material/Drawer';
import React, { Dispatch, SetStateAction } from 'react';

import { IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import menuItems from './menuItems';

import { SIDEBAR_NAV_DIMENSIONS } from '@global/constants/page';
import { getFullRoute } from '@global/helpers/routing';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getUserModeEnabledMenuItems } from './helpers';
import { SubMenuItem } from './types';

const selectedMenuItemColor = '#c78484';

const renderSubMenuItems = (
  subMenuItems: SubMenuItem[],
  navigate: NavigateFunction,
  isLeftNaveOpen: boolean,
  iconTextStyle: any
) => {
  const location = useLocation();
  const fullRoute = getFullRoute(location);

  if (!subMenuItems.length) {
    return null;
  }

  return (
    <List
      sx={{
        width: SIDEBAR_NAV_DIMENSIONS.widthOpen,
        flexFlow: 'column nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        ...{ display: isLeftNaveOpen ? 'flex' : 'none' },
        paddingLeft: '40px',
        paddingTop: '0px'
      }}
    >
      {subMenuItems.map(({ label, route }) => (
        <ListItem
          button
          onClick={() => {
            navigate(route);
          }}
          key={`submenu-lvl-${label}`}
          sx={{
            padding: 0,
            display: 'flex',
            justifyContent: 'initial'
          }}
        >
          <ListItemText
            sx={{
              ...iconTextStyle.text,
              ...{
                color: fullRoute === route ? selectedMenuItemColor : 'inherit'
              },
              '& span': {
                marginLeft: '-10px',
                fontWeight: '600',
                fontSize: '15px'
              }
            }}
            primary={label}
          />
        </ListItem>
      ))}
    </List>
  );
};

const SideNavigationBar = ({
  setIsLeftNaveOpen,
  isLeftNaveOpen
}: {
  setIsLeftNaveOpen: Dispatch<SetStateAction<boolean>>;
  isLeftNaveOpen: boolean;
}) => {
  const { userState } = useUserContext();

  const navigate = useNavigate();
  const location = useLocation();

  const fullRoute = getFullRoute(location);

  const userModeEnabledMenuItems = getUserModeEnabledMenuItems(
    userState.mode,
    menuItems
  );

  const handleDrawer = () => {
    setIsLeftNaveOpen(!isLeftNaveOpen);
  };

  const iconTextStyle = {
    icons: {
      color: 'rgba(255, 255, 255, 0.7)!important',
      minWidth: isLeftNaveOpen ? '56px' : '35px',
      marginLeft: isLeftNaveOpen ? '0px' : '0px'
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
      variant="permanent"
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
          transition: (theme) => theme.transitions.create('width', {
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
        <ListItem sx={{ padding: 0, margin: 0, fontWeight: 600 }}>BVS</ListItem>
        <ListItem sx={{ padding: 0, margin: 0, justifyContent: 'end' }}>
          <IconButton sx={{ padding: 0 }} onClick={handleDrawer}>
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
        {userModeEnabledMenuItems.map(
          ({
            label, icon, route, subMenuItems
          }) => (
            <React.Fragment key={`${label}-main-lvl`}>
              <ListItem
                button
                onClick={() => {
                  navigate(route);
                }}
                key={`${label}-main-lvl-list-item`}
                sx={{
                  width: SIDEBAR_NAV_DIMENSIONS.widthOpen,
                  display: 'flex',
                  justifyContent: isLeftNaveOpen ? 'initial' : 'flex-start'
                }}
              >
                <ListItemIcon sx={iconTextStyle.icons}>{icon}</ListItemIcon>
                <ListItemText
                  sx={{
                    ...{
                      color:
                        fullRoute === route ? selectedMenuItemColor : 'inherit'
                    },
                    ...iconTextStyle.text,
                    ...{ display: isLeftNaveOpen ? 'block' : 'none' }
                  }}
                  primary={label}
                />
              </ListItem>

              {renderSubMenuItems(
                subMenuItems,
                navigate,
                isLeftNaveOpen,
                iconTextStyle
              )}
            </React.Fragment>
          )
        )}
      </List>
    </Drawer>
  );
};

export default SideNavigationBar;
