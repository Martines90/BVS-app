import React from 'react';
import { useParams } from 'react-router-dom';

const VotingPage: React.FC = () => {
  const { votingKey } = useParams<{ votingKey: string }>();

  return <div>Welcome at {votingKey} voting info page.</div>;
};

export default VotingPage;
