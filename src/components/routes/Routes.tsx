import { lazy } from 'react';
import { Route, Routes as Routes_ } from 'react-router-dom';

const PageNotFound = lazy(() => import('@pages/page-not-found/PageNotFound'));
const Dashboard = lazy(() => import('@pages/dashboard/DashboardPage'));
const Community = lazy(() => import('@pages/community/CommunityPage'));
const Approvals = lazy(() => import('@pages/approvals/ApprovalsPage'));
const Elections = lazy(() => import('@pages/elections/ElectionsPage'));

const PoliticalActor = lazy(
  () => import('@pages/community/political-actor/PoliticalActorPage')
);
const Votings = lazy(() => import('@pages/votings/VotingPage'));

const Profile = lazy(() => import('@pages/profile/ProfilePage'));

const Routes = () => (
  // eslint-disable-next-line react/jsx-pascal-case
  <Routes_>
    <Route path="/" element={<Dashboard />} />

    {/** Approvals */}
    <Route path="/approvals" element={<Approvals />} />

    {/** Voting */}
    <Route path="/votings" element={<Votings />} />

    {/** Elections */}
    <Route path="/elections" element={<Elections />} />

    {/** Community */}
    <Route path="/community" element={<Community />} />
    <Route
      path="/community/political-actor/:politicalActorKey"
      element={<PoliticalActor />}
    />

    <Route path="/profile" element={<Profile />} />

    <Route path="*" element={<PageNotFound />} />
  </Routes_>
);

export default Routes;
