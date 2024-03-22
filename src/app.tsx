import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import { Header, Main, Footer } from './components/page';
import { CssBaseline, Container, Box } from '@mui/material';

const Dashboard = lazy(() => import('./pages/dashboard/DashboardPage'));
const VotingPool = lazy(() => import('./pages/voting-pool/VotingPoolPage'));
const Citizens = lazy(() => import('./pages/citizens/CitizensPage'));
const PoliticalActors = lazy(
  () => import('./pages/political-actors/PoliticalActorsPage')
);
const PoliticalActor = lazy(
  () => import('./pages/political-actor/PoliticalActorPage')
);
const Voting = lazy(() => import('./pages/voting/VotingPage'));

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        <Header />
        <Container component='main' maxWidth={false}>
          <Main>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route
                  path='/'
                  element={<Navigate replace to='/dashboard' />}
                />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/voting-pool' element={<VotingPool />} />
                <Route path='/citizens' element={<Citizens />} />
                <Route path='/political-actors' element={<PoliticalActors />} />
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
    </Router>
  );
};

const root = ReactDOM.createRoot((document as any).getElementById('root'));

root.render(<App />);
