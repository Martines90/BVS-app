import ApplyForCitizenshipWarning from '@components/alerts/applyForCitizenshipWarning/ApplyForCitizenshipWarning';
import { USER_MODES } from '@global/types/user';
import useRenderMainContentCheck from '@hooks/check/useRenderMainContentCheck';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { Box } from '@mui/material';
import * as React from 'react';
import MainBreadcrumbs from './breadcrumbs/mainBreadcrumbs/MainBreadcrumbs';
import { MainProps } from './types';

const Main = ({ children }: MainProps) => {
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
