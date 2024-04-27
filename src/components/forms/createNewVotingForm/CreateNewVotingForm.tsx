import LoadContent from '@components/general/Loaders/LoadContent';
import { Stack } from '@mui/material';
import { useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

const CreateNewVotingForm = () => {
  const [votingInfo, setVotingInfo] = useState();
  return (
    <FormContainer>
      <FormTitle>Create new voting</FormTitle>
      <LoadContent condition={!votingInfo}>
        <Stack spacing={2} />
      </LoadContent>
    </FormContainer>
  );
};

export default CreateNewVotingForm;
