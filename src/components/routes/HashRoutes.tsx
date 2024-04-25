import { lazy } from 'react';

import { useLocation } from 'react-router-dom';

// community
const ApplyForCitizenshipPage = lazy(
  () => import('@pages/citizens/apply-for-citizenship/ApplyForCitizenshipPage')
);

// approvals
const ApproveCitizenshipApplicationPage = lazy(
  () => import('@pages/approvals/ApproveCitizenshipApplicationPage')
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
  if (hash === '#apply_for_citizenship') {
    return <ApplyForCitizenshipPage />;
  }

  // approvals
  if (hash === '#citizenship') {
    return <ApproveCitizenshipApplicationPage />;
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
