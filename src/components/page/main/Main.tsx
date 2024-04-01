import * as React from 'react';
import { Box } from '@mui/material';
import { MainProps } from './types';
import useRenderMainContentCheck from '@hooks/check/useRenderMainContentCheck';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { USER_MODES } from '@global/types/user';
import ApplyForCitizenshipWarning from '@components/alerts/applyForCitizenshipWarning/ApplyForCitizenshipWarning';
import MainBreadcrumbs from './breadcrumbs/mainBreadcrumbs/MainBreadcrumbs';

const Main: React.FC<MainProps> = ({ children }) => {
  const { userState } = useUserContext();
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
      <MainBreadcrumbs />
      {userState.mode === USER_MODES.GUEST && <ApplyForCitizenshipWarning />}
      {children}
    </Box>
  );
};

export default Main;
