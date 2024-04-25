import React from 'react';
import { useParams } from 'react-router-dom';

const PoliticalActor: React.FC = () => {
  const { politicalActorKey } = useParams<{ politicalActorKey: string }>();

  return <div>Welcome at {politicalActorKey} political actor info page.</div>;
};

export default PoliticalActor;
