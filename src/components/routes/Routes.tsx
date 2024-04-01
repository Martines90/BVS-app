import { lazy } from 'react';
import { Routes as Routes_, Route } from 'react-router-dom';

const PageNotFound = lazy(() => import('@pages/page-not-found/PageNotFound'));
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

const Profile = lazy(() => import('@pages/profile/ProfilePage'));

const Routes = () => {
  return (
    <Routes_>
      <Route path='/' element={<Dashboard />} />
      <Route path='/voting-pool' element={<VotingPool />} />
      <Route path='/citizens' element={<Citizens />} />
      <Route path='/approvals' element={<Approvals />} />
      <Route path='/political-actors' element={<PoliticalActors />} />
      <Route
        path='/political-actor/:politicalActorKey'
        element={<PoliticalActor />}
      />
      <Route path='/voting/:votingKey' element={<Voting />} />

      <Route path='/profile' element={<Profile />} />

      <Route path='*' element={<PageNotFound />} />
    </Routes_>
  );
};

export default Routes;
