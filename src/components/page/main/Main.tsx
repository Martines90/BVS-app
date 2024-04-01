import * as React from 'react';
import { Alert, Box, Link } from '@mui/material';
import { MainProps } from './types';
import useRenderMainContentCheck from '@hooks/check/useRenderMainContentCheck';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { USER_MODES } from '@global/types/user';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Main: React.FC<MainProps> = ({ children }) => {
  const { userState } = useUserContext();
  const navigate = useNavigate();
  const { renderMainContent } = useRenderMainContentCheck();

  if (!renderMainContent) {
    return null;
  }

  const StyledLink = styled(Link)`
    font-family: 'Source Sans Pro';
    color: #663c00;
    padding: 4px 0;
    cursor: pointer;
  `;

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
      {userState.mode === USER_MODES.GUEST && (
        <Alert
          sx={{ margin: '10px auto' }}
          severity='warning'
          action={
            <StyledLink onClick={() => navigate('profile')}>
              Apply for citizenship
            </StyledLink>
          }
        >
          You need cizizenship to be part of the community!
        </Alert>
      )}
      {children}
    </Box>
  );
};

export default Main;
