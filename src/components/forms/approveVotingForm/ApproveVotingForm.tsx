import ToggleList from '@components/ToggleList/ToggleList';
import LoadContent from '@components/general/Loaders/LoadContent';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';
import PdfViewer from '@components/pdfViewer/PdfViewer';
import { IPFS_GATEWAY_URL } from '@global/constants/general';
import { formatDateTime, getNow } from '@global/helpers/date';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Button, Stack,
  TextField,
  Typography
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

import Label from '@components/general/Label/Label';
import LabelComponent from '@components/general/LabelComponent/LabelComponent';
import LabelText from '@components/general/LabelText/LabelText';
import SubTitle from '@components/general/SubTitle/SubTitle';
import YesNoText from '@components/general/YesNoText/YesNoText';
import PdfIpfsContentViewer from '@components/pdfIpfsContentViewer/PdfIpfsContentViewer';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import ArticleIcon from '@mui/icons-material/Article';
import IpfsFileUpload, { FileInfo } from '../components/IpfsFileUpload';
import QuizQuestionEditor from './components/QuizQuestionsEditor';

type VotingInfo = {
  key?: string;
  deadlineTillApproveDate?: string;
  contentIpfsHash?: string;
  approved?: boolean;
};

type InitialValues = {
  contentIpfsHash: string
};

const formInitialValues: InitialValues = {
  contentIpfsHash: ''
};

/*
 function assignQuizIpfsHashToVoting(
        bytes32 _votingKey,
        string memory _quizIpfsHash
    ) public onlyRole(ADMINISTRATOR) votingExists(_votingKey) {
        votings[_votingKey].votingContentCheckQuizIpfsHash = _quizIpfsHash;
    }

    function addKeccak256HashedAnswersToVotingContent(
        bytes32 _votingKey,
        bytes32[] memory _keccak256HashedAnswers
    )

*/

const ApproveVotingForm = () => {
  const { hash } = useLocation();
  const { getVotingAtKey } = useContract();
  const [answers, setAnswers] = useState<string[]>([]);

  const [fileInfo, setFileInfo] = useState<FileInfo>({});

  const [votingKey, setVoatingKey] = useState(hash.includes('?voting_key=') ? hash.split('?voting_key=')[1] : '');
  const [votingKeyFieldVal, setVotingKeyFieldVal] = useState(votingKey);
  const [votingInfo, setVotingInfo] = useState<VotingInfo>();
  const [isLoading, setIsLoading] = useState(true);

  const now = getNow();

  const loadVoting = () => {
    setVoatingKey(votingKeyFieldVal);
  };

  useEffect(() => {
    const loadVotingInfo = async () => {
      if (votingKey) {
        const voting = await asyncErrWrapper(getVotingAtKey)(votingKey);

        setVotingInfo({
          key: (voting?.key || '') as string,
          deadlineTillApproveDate: formatDateTime(voting?.startDate) || '',
          contentIpfsHash: voting?.contentIpfsHash || '',
          approved: !!voting?.approved
        });
      } else {
        setVotingInfo({});
      }
      setIsLoading(false);
    };

    loadVotingInfo();
  }, [votingKey]);

  if (isLoading) {
    return <CommunicationWithContractIsInProgressLoader />;
  }

  const canApprove = !votingInfo?.approved;

  return (
    <FormContainer css={{ maxWidth: 1000, width: 1000 }}>
      <FormTitle>Approve voting</FormTitle>
      <LoadContent condition={!votingInfo}>
        <Formik
          initialValues={formInitialValues}
          onSubmit={(values, { setSubmitting }) => {

          }}
        >
          {({
            setFieldValue, values, errors, touched, handleChange
          }) => (
            <Form>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Label text="Key:" />
                  <TextField
                    name="voting-key"
                    fullWidth
                    value={votingKeyFieldVal}
                    onChange={
                          (e) => { setVotingKeyFieldVal(e.target.value); }
                        }
                  />
                  <Button sx={{ width: '200px' }} variant="contained" onClick={() => loadVoting()}>LOAD VOTING</Button>
                </Stack>
                {votingInfo?.key === '' && (
                <Alert severity="info">
                  There is no existing voting under this key.
                </Alert>
                )}
                {votingInfo && (
                <Stack spacing={2}>
                  <LabelComponent label="Approved:" component={<YesNoText text={votingInfo.approved ? 'yes' : 'no'} />} />
                  <LabelText label="Approve deadline:" text={votingInfo.deadlineTillApproveDate} />
                  <ToggleList
                    listItemComponents={[
                      {
                        labelText: 'Voting content description',
                        component: <PdfViewer documentUrl={`${IPFS_GATEWAY_URL}/${votingInfo.contentIpfsHash}`} />,
                        icon: <ArticleIcon />
                      }
                    ]}
                  />
                  <SubTitle text="Assign IPFS Quiz hash" />
                  <IpfsFileUpload
                    fileInfo={fileInfo}
                    setFileInfo={setFileInfo}
                    setFieldValue={setFieldValue}
                  />
                  <Field
                    as={TextField}
                    name="contentIpfsHash"
                    label="Content ipfs hash reference"
                    fullWidth
                    error={touched.contentIpfsHash && !!errors.contentIpfsHash}
                    helperText={touched.contentIpfsHash && errors.contentIpfsHash}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFieldValue('contentIpfsHash', e.target.value);
                    }}
                  />
                  <Stack spacing={2} direction="row">
                    <PdfIpfsContentViewer ipfsHash={values.contentIpfsHash || ''} />
                    <Button color="info" disabled={!values.contentIpfsHash} variant="contained">ASSIGN IPFS HASH TO VOTING</Button>
                  </Stack>
                  <SubTitle text="Assign answers" />
                  <QuizQuestionEditor answers={answers} setAnswers={setAnswers} />
                  <Stack spacing={2} direction="row">
                    <Button color="info" disabled={!answers.length} variant="contained">ASSIGN ANSWERS TO VOTING</Button>
                  </Stack>
                  <Stack>
                    <Button color="success" disabled={!canApprove} variant="contained">APPROVE</Button>
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

export default ApproveVotingForm;
