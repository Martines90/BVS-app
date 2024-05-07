import LabelText from '@components/general/LabelText/LabelText';
import LoadContent from '@components/general/Loaders/LoadContent';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import useContract from '@hooks/contract/useContract';
import {
  Alert, Stack, Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

type VotingInfo = {
  key?: string;
  startDate?: string;
};

const VotingForm = () => {
  const { userState } = useUserContext();
  const { hash } = useLocation();
  const { getVotingAtKey } = useContract();

  const [votingInfo, setVotingInfo] = useState<VotingInfo>();
  const [isLoading, setIsLoading] = useState(true);

  const votingKey = hash.split('?voting_key=')[1];

  useEffect(() => {
    const loadVotingInfo = async () => {

    };

    loadVotingInfo();
  }, []);

  if (isLoading) {
    return <CommunicationWithContractIsInProgressLoader />;
  }

  if (votingInfo?.key === '') {
    return (
      <FormContainer>
        <Alert severity="info">
          There is no existing voting under this Key: {votingKey}.
        </Alert>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>Voting form</FormTitle>
      <LoadContent condition={!votingInfo}>
        <Formik
          initialValues={{}}
          onSubmit={(values, { setSubmitting }) => {

          }}
        >
          {() => (
            <Form>
              <Stack spacing={2}>
                <Typography>
                  Selected voting key: {votingKey}
                </Typography>
                {votingInfo && (
                <Stack spacing={2}>
                  <LabelText label="Start date:" text={votingInfo.startDate} />
                </Stack>
                )}
              </Stack>
            </Form>
          )}
        </Formik>
      </LoadContent>
    </FormContainer>
  );
};

export default VotingForm;
