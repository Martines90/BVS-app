import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import { Header, Main, Footer } from '@components/page';
import { CssBaseline, Container, Box, Stack } from '@mui/material';
import UserContextWrapper from '@hooks/context/userContext/UserContextWrapper';
import ModalContextWrapper from '@hooks/context/modalContext/ModalContextWrapper';
import ThemeProviderWrapper from '@hooks/context/themeContext/ThemeContextWrapper';
import MetamaskContextWrapper from '@hooks/context/metamaskContext/MetamaskContextWrapper';
import InfoContextWrapper from '@hooks/context/infoContext/InfoContextWrapper';
import SideNavigationBar from '@components/sideNavigationBar/SideNavigationBar';
import { SIDEBAR_NAV_DIMENSIONS } from '@global/constants/page';
import PageNotFound from '@pages/page-not-found/PageNotFound';

const Dashboard = lazy(() => import('@pages/dashboard/DashboardPage'));
const VotingPool = lazy(() => import('@pages/voting-pool/VotingPoolPage'));
const Approvals = lazy(() => import('@pages/approvals/ApprovalsPage'));
const Citizens = lazy(() => import('@pages/citizens/CitizensPage'));
const PoliticalActors = lazy(
  () => import('@pages/political-actors/PoliticalActorsPage')
);
const PoliticalActor = lazy(
  () => import('@pages/political-actor/PoliticalActorPage')
);
const Voting = lazy(() => import('@pages/voting/VotingPage'));

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
                    <Container component='main' maxWidth={false}>
                      <Main>
                        <Suspense fallback={<div>Loading...</div>}>
                          <Routes>
                            <Route path='/' element={<Dashboard />} />
                            <Route
                              path='/voting-pool'
                              element={<VotingPool />}
                            />
                            <Route path='/citizens' element={<Citizens />} />
                            <Route path='/approvals' element={<Approvals />} />
                            <Route
                              path='/political-actors'
                              element={<PoliticalActors />}
                            />
                            <Route
                              path='/political-actor/:politicalActorKey'
                              element={<PoliticalActor />}
                            />
                            <Route
                              path='/voting/:votingKey'
                              element={<Voting />}
                            />
                            <Route path='*' element={<PageNotFound />} />
                          </Routes>
                        </Suspense>
                      </Main>
                    </Container>
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
