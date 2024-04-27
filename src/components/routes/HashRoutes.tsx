import { lazy } from 'react';

import { useLocation } from 'react-router-dom';

// community
const ApplyForCitizenshipPage = lazy(
  () => import('@pages/community/apply-for-citizenship/ApplyForCitizenshipPage')
);

const CitizensPage = lazy(
  () => import('@pages/community/citizens/CitizensPage')
);

const PoliticalActorsPage = lazy(
  () => import('@pages/community/political-actors/PoliticalActorsPage')
);

const AdministratorsPage = lazy(
  () => import('@pages/community/administrators/AdministratorsPage')
);

// approvals
const ApproveCitizenshipApplicationPage = lazy(
  () => import('@pages/approvals/ApproveCitizenshipApplicationPage')
);

// votings

const CreateNewVotingPage = lazy(
  () => import('@pages/votings/create-new-voting/CreateNewVotingPage')
);

const FirstVotingCycleStartDatePage = lazy(
  () => import('@pages/votings/first-voting-cycle-start/FirstVotingCycleStartPage')
);

// elections
const ScheduleNextElectionsPage = lazy(
  () => import('@pages/elections/schedule-next-elections/ScheduleNextElectionsPage')
);
const CloseElectionsPage = lazy(
  () => import('@pages/elections/close-elections/CloseElectionsPage')
);
const OngoingAndScheduledElectionsPage = lazy(
  () => import('@pages/elections/ongoing-scheduled-elections/OngoingScheduledElectionsPage')
);
const RegisterAsCandidatePage = lazy(
  () => import('@pages/elections/register-as-candidate/RegisterAsCandidatePage')
);

const HashRoutes = ({ mainPageName }: { mainPageName: string }) => {
  const { hash } = useLocation();

  // community
  if (hash === '#citizens') {
    return <CitizensPage />;
  }

  if (hash === '#political_actors') {
    return <PoliticalActorsPage />;
  }

  if (hash === '#administrators') {
    return <AdministratorsPage />;
  }

  if (hash === '#apply_for_citizenship') {
    return <ApplyForCitizenshipPage />;
  }

  // approvals
  if (hash === '#citizenship_approval') {
    return <ApproveCitizenshipApplicationPage />;
  }

  // votings
  if (hash === '#create_new_voting') {
    return <CreateNewVotingPage />;
  }

  if (hash === '#manage_first_voting_cycle') {
    return <FirstVotingCycleStartDatePage />;
  }

  // elections
  if (hash === '#schedule_next_elections') {
    return <ScheduleNextElectionsPage />;
  }

  if (hash === '#close_elections') {
    return <CloseElectionsPage />;
  }

  if (hash === '#ongoing_next_elections') {
    return <OngoingAndScheduledElectionsPage />;
  }

  if (hash === '#register_as_candidate') {
    return <RegisterAsCandidatePage />;
  }

  return (
    <div>
      Welcome at {mainPageName} ({hash}) page
    </div>
  );
};

export default HashRoutes;
