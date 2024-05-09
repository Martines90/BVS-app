import ToggleList from '@components/ToggleList/ToggleList';
import LabelText from '@components/general/LabelText/LabelText';
import LoadContent from '@components/general/Loaders/LoadContent';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';
import PdfViewer from '@components/pdfViewer/PdfViewer';
import { IPFS_GATEWAY_URL } from '@global/constants/general';
import { formatDateTime, getNow } from '@global/helpers/date';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Button, Stack,
  Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';
import ContentCheckQuizForm from '../contentCheckQuizForm/ContentCheckQuizForm';

import LabelComponent from '@components/general/LabelComponent/LabelComponent';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import ArticleIcon from '@mui/icons-material/Article';
import QuizIcon from '@mui/icons-material/Quiz';

type VotingInfo = {
  key?: string;
  startDate?: string;
  contentIpfsHash?: string;
  approved: boolean;
  relatedVotingScore: number;
  active: boolean;
  numberOfVotes: number;
  voteOnAScore: number;
  voteOnBScore: number;
};

const YesNoText = ({ text }: { text: 'yes' | 'no' }) => <Typography sx={{ color: (text === 'yes' ? 'green' : 'red') }}>{text}</Typography>;

const VotingForm = () => {
  const { hash } = useLocation();
  const { userState } = useUserContext();
  const { getVotingAtKey, getAccountVotingScore, getVotingDuration } = useContract();
  // calculateVoteScore

  const [votingInfo, setVotingInfo] = useState<VotingInfo>();
  const [isLoading, setIsLoading] = useState(true);

  const votingKey = hash.split('?voting_key=')[1];

  const now = getNow();

  useEffect(() => {
    const loadVotingInfo = async () => {
      const voting = await asyncErrWrapper(getVotingAtKey)(votingKey);
      const accountVotingScore = await asyncErrWrapper(getAccountVotingScore)(
        voting?.key || '',
        userState.walletAddress || ''
      );
      const votingDuration = await asyncErrWrapper(getVotingDuration)() || 0;

      const isVotingActive = now > (
        voting?.startDate || 0) && now < (voting?.startDate || 0) + votingDuration;

      setVotingInfo({
        key: (voting?.key || '') as string,
        startDate: formatDateTime(voting?.startDate) || '',
        contentIpfsHash: voting?.contentIpfsHash || '',
        approved: !!voting?.approved,
        relatedVotingScore: accountVotingScore || 0,
        active: isVotingActive,
        numberOfVotes: voting?.voteCount || 0,
        voteOnAScore: voting?.voteOnAScore || 0,
        voteOnBScore: voting?.voteOnBScore || 0
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

  const canVote = votingInfo?.active && votingInfo?.approved;

  return (
    <FormContainer css={{ maxWidth: 1000, width: 1000 }}>
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
                  <Stack direction="row" spacing={10}>
                    <Stack>
                      <LabelText label="Start date:" text={votingInfo.startDate} />
                      <LabelComponent label="Approved:" component={<YesNoText text={votingInfo.approved ? 'yes' : 'no'} />} />
                      <LabelComponent label="Active:" component={<YesNoText text={votingInfo.active ? 'yes' : 'no'} />} />
                    </Stack>
                    <Stack>
                      <LabelText label="Total number of votes:" text={votingInfo.numberOfVotes} />
                      <LabelText label='Score on "Yes":' text={votingInfo.voteOnAScore} />
                      <LabelText label='Score on "No":' text={votingInfo.voteOnBScore} />
                    </Stack>
                  </Stack>
                  <LabelText label="Your voting score:" text={votingInfo.relatedVotingScore} />
                  <ToggleList
                    listItemComponents={[
                      {
                        labelText: 'Voting content description',
                        component: <PdfViewer documentUrl={`${IPFS_GATEWAY_URL}/${votingInfo.contentIpfsHash}`} />,
                        icon: <ArticleIcon />
                      },
                      {
                        labelText: 'Voting content check quiz',
                        component: <ContentCheckQuizForm />,
                        icon: <QuizIcon />
                      }
                    ]}
                  />

                  <Stack direction="row" spacing={2}>
                    <Button sx={{ width: '50%' }} disabled={!canVote} variant="contained">YES</Button>
                    <Button sx={{ width: '50%' }} disabled={!canVote} variant="contained">NO</Button>
                  </Stack>
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
