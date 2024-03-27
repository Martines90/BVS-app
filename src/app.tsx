import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import { Header, Main, Footer } from '@components/page';
import { CssBaseline, Container, Box } from '@mui/material';
import UserContextWrapper from '@hooks/context/userContext/UserContextWrapper';
import ModalContextWrapper from '@hooks/context/modalContext/ModalContextWrapper';
import UserChooseModeModal from '@components/UserChooseModeModal/UserChooseModeModal';
import ThemeProviderWrapper from '@hooks/context/themeContext/ThemeContextWrapper';
import MetamaskContextWrapper from '@hooks/context/metamaskContext/MetamaskContextWrapper';

const Dashboard = lazy(() => import('@pages/dashboard/DashboardPage'));
const VotingPool = lazy(() => import('@pages/voting-pool/VotingPoolPage'));
const Citizens = lazy(() => import('@pages/citizens/CitizensPage'));
const PoliticalActors = lazy(
  () => import('@pages/political-actors/PoliticalActorsPage')
);
const PoliticalActor = lazy(
  () => import('@pages/political-actor/PoliticalActorPage')
);
const Voting = lazy(() => import('@pages/voting/VotingPage'));

const App: React.FC = () => {
  return (
    <Router>
      <MetamaskContextWrapper>
        <ThemeProviderWrapper>
          <UserContextWrapper>
            <ModalContextWrapper>
              <CssBaseline />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh'
                }}
              >
                <Header />
                <Container component='main' maxWidth={false}>
                  <Main>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Routes>
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/voting-pool' element={<VotingPool />} />
                        <Route path='/citizens' element={<Citizens />} />
                        <Route
                          path='/political-actors'
                          element={<PoliticalActors />}
                        />
                        <Route
                          path='/political-actor/:politicalActorKey'
                          element={<PoliticalActor />}
                        />
                        <Route path='/voting/:votingKey' element={<Voting />} />
                      </Routes>
                    </Suspense>
                  </Main>
                </Container>
                <Footer />
              </Box>
              <UserChooseModeModal />
            </ModalContextWrapper>
          </UserContextWrapper>
        </ThemeProviderWrapper>
      </MetamaskContextWrapper>
    </Router>
  );
};

const root = ReactDOM.createRoot((document as any).getElementById('root'));

root.render(<App />);
