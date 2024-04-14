import React, { lazy } from 'react';

import { useLocation } from 'react-router-dom';

// approvals
const ApproveCitizenshipApplicationPage = lazy(
  () => import('@pages/approvals/ApproveCitizenshipApplicationPage')
);

// elections
const ScheduleNextElectionsPage = lazy(
  () => import('@pages/elections/schedule-next-elections/ScheduleNextElectionsPage')
);
const OngoingAndScheduledElections = lazy(
  () => import('@pages/elections/ongoing-scheduled-elections/OngoingScheduledElectionsPage')
);

const HashRoutes = ({ mainPageName }: { mainPageName: string }) => {
  const { hash } = useLocation();

  // approvals
  if (hash === '#citizenship') {
    return <ApproveCitizenshipApplicationPage />;
  }

  // elections
  if (hash === '#schedule_next_elections') {
    return <ScheduleNextElectionsPage />;
  }

  if (hash === '#ongoing_next_elections') {
    return <OngoingAndScheduledElections />;
  }

  return (
    <div>
      Welcome at {mainPageName} ({hash}) page
    </div>
  );
};

export default HashRoutes;
