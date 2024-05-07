import LabelText from '@components/general/LabelText/LabelText';
import LoadContent from '@components/general/Loaders/LoadContent';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';
import PdfViewer from '@components/pdfViewer/PdfViewer';
import { IPFS_GATEWAY_URL } from '@global/constants/general';
import { formatDateTime } from '@global/helpers/date';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Stack
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

type VotingInfo = {
  key?: string;
  startDate?: string;
  contentIpfsHash?: string;
};

const VotingForm = () => {
  const { hash } = useLocation();
  const { getVotingAtKey } = useContract();

  const [votingInfo, setVotingInfo] = useState<VotingInfo>();
  const [isLoading, setIsLoading] = useState(true);

  const votingKey = hash.split('?voting_key=')[1];

  useEffect(() => {
    const loadVotingInfo = async () => {
      const voting = await asyncErrWrapper(getVotingAtKey)(votingKey);
      setVotingInfo({
        key: (voting?.key || '') as string,
        startDate: formatDateTime(voting?.startDate) || '',
        contentIpfsHash: voting?.contentIpfsHash || ''
      });
      setIsLoading(false);
    };

    loadVotingInfo();
  }, [votingKey]);

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
    <FormContainer css={{ maxWidth: 800 }}>
      <FormTitle>Voting</FormTitle>
      <LoadContent condition={!votingInfo}>
        <Formik
          initialValues={{}}
          onSubmit={(values, { setSubmitting }) => {

          }}
        >
          {() => (
            <Form>
              <Stack spacing={2}>
                <LabelText label="Key:" text={votingKey} />
                {votingInfo && (
                <Stack spacing={2}>
                  <LabelText label="Start date:" text={votingInfo.startDate} />
                  <PdfViewer documentUrl={`${IPFS_GATEWAY_URL}/${votingInfo.contentIpfsHash}`} />
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
