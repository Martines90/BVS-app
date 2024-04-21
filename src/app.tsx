import React, { Suspense, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import Loading from '@components/general/Loaders/Loading';
import { Footer, Header, Main } from '@components/page';
import Routes from '@components/routes/Routes';
import SideNavigationBar from '@components/sideNavigationBar/SideNavigationBar';
import { SIDEBAR_NAV_DIMENSIONS } from '@global/constants/page';
import InfoContextWrapper from '@hooks/context/infoContext/InfoContextWrapper';
import MetamaskContextWrapper from '@hooks/context/metamaskContext/MetamaskContextWrapper';
import ModalContextWrapper from '@hooks/context/modalContext/ModalContextWrapper';
import ThemeProviderWrapper from '@hooks/context/themeContext/ThemeContextWrapper';
import UserContextWrapper from '@hooks/context/userContext/UserContextWrapper';
import {
    Box,
    Container,
    CssBaseline,
    Stack
} from '@mui/material';

import { MainToastContainer } from '@components/toasts/Toasts';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [isLeftNavOpen, setIsLeftNaveOpen] = useState(false);
  return (
    <Router>
      <InfoContextWrapper>
        <MetamaskContextWrapper>
          <ThemeProviderWrapper>
            <UserContextWrapper>
              <ModalContextWrapper>
                <CssBaseline />
                <Stack direction={isLeftNavOpen ? 'column' : 'row'}>
                  <SideNavigationBar
                    setIsLeftNaveOpen={setIsLeftNaveOpen}
                    isLeftNaveOpen={isLeftNavOpen}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '100vh',
                      width: isLeftNavOpen
                        ? `calc(100% - ${SIDEBAR_NAV_DIMENSIONS.widthClosed}px)`
                        : '100%',
                      ml: isLeftNavOpen
                        ? `${SIDEBAR_NAV_DIMENSIONS.widthClosed}px`
                        : 0
                    }}
                  >
                    <Header />
                    <Container
                      component="main"
                      sx={{ pb: '24px' }}
                      maxWidth={false}
                    >
                      <Main>
                        <Suspense fallback={<Loading />}>
                          <Routes />
                        </Suspense>
                      </Main>
                    </Container>
                    <MainToastContainer />
                    <Footer />
                  </Box>
                </Stack>
              </ModalContextWrapper>
            </UserContextWrapper>
          </ThemeProviderWrapper>
        </MetamaskContextWrapper>
      </InfoContextWrapper>
    </Router>
  );
};

const root = ReactDOM.createRoot((document as any).getElementById('root'));

root.render(<App />);
