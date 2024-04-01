import React from 'react';

import { useLocation } from 'react-router-dom';

const CommunityPage: React.FC = () => {
  const { hash } = useLocation();

  return <div>Welcome at Community ({hash}) page</div>;
};

export default CommunityPage;
