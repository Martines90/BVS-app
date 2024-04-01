import React from 'react';

import { useLocation } from 'react-router-dom';

const ApprovalsPage: React.FC = () => {
  const { hash } = useLocation();

  return <div>Welcome at Approvals ({hash}) page</div>;
};

export default ApprovalsPage;
