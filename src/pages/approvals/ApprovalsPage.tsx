import React, { lazy } from 'react';

import { useLocation } from 'react-router-dom';

const ApproveCitizenshipApplicationPage = lazy(
  () => import('@pages/approvals/ApproveCitizenshipApplicationPage')
);

const ApprovalsPage: React.FC = () => {
  const { hash } = useLocation();

  if (hash === '#citizenship') {
    return <ApproveCitizenshipApplicationPage />;
  }

  return <div>Welcome at Approvals ({hash}) page</div>;
};

export default ApprovalsPage;
