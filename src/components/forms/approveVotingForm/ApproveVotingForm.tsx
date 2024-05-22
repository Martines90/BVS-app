import ToggleList from '@components/ToggleList/ToggleList';
import LoadContent from '@components/general/Loaders/LoadContent';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';
import PdfViewer from '@components/pdfViewer/PdfViewer';
import { IPFS_GATEWAY_URL } from '@global/constants/general';
import { formatDateTimeToTime, getNow } from '@global/helpers/date';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Button, Stack,
  TextField
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
import { showSuccessToast } from '@components/toasts/Toasts';
import { GWEI_TO_WEI } from '@global/constants/blockchain';
import { toBytes32ToKeccak256, toKeccak256HashToBytes32 } from '@global/helpers/hash-manipulation';
import { Voting } from '@hooks/contract/types';
import ArticleIcon from '@mui/icons-material/Article';
import IpfsFileUpload, { FileInfo } from '../components/IpfsFileUpload';
import QuizQuestionEditor from './components/QuizQuestionsEditor';

type VotingInfo = {
  oVoting?: Voting;
  key?: string;
  startDate?: string;
  targetBudgetInGwei?: number;
  contentIpfsHash?: string;
  contentCheckQuizIpfsHash?: string;
  approved?: boolean;
  canApprove?: boolean;
  numOfAssignedAnswers?: number;
  minTotalCheckQuizAnswers?: number;
  approveMaxTimeBeforeVotingStarts?: number;
};

type InitialValues = {
  contentIpfsHash: string
};

const formInitialValues: InitialValues = {
  contentIpfsHash: ''
};

const ApproveVotingForm = () => {
  const { hash } = useLocation();
  const {
    getVotingAtKey,
    addAnswersToVotingContent,
    approveVoting,
    assignQuizIpfsHashToVoting,
    getApproveVotingMinTimeAfterLimit,
    getVotingContentReadCheckAnswersLength,
    getMinTotalQuizCheckAnswers
  } = useContract();
  const [answers, setAnswers] = useState<string[]>([]);
  const [contentIpfsHashInput, setContentIpfsHashInput] = useState('');

  const [fileInfo, setFileInfo] = useState<FileInfo>({});

  const [votingKey, setVotingKey] = useState(hash.includes('?voting_key=') ? hash.split('?voting_key=')[1] : '');
  const [votingKeyFieldVal, setVotingKeyFieldVal] = useState(votingKey);
  const [votingInfo, setVotingInfo] = useState<VotingInfo>();
  const [isLoading, setIsLoading] = useState(true);

  const now = getNow();

  const loadVoting = () => {
    setVotingKey(votingKeyFieldVal);
  };

  useEffect(() => {
    const loadVotingInfo = async () => {
      if (votingKey) {
        const voting = await asyncErrWrapper(getVotingAtKey)(votingKey);
        const _minTotalCheckQuizAnswers = await asyncErrWrapper(getMinTotalQuizCheckAnswers)();
        const _numOfAssignedAnswers = await asyncErrWrapper(
          getVotingContentReadCheckAnswersLength
        )(votingKey);
        const _approveMaxTimeBeforeVotingStarts = Number(await asyncErrWrapper(
          getApproveVotingMinTimeAfterLimit
        )());

        setVotingInfo({
          oVoting: voting,
          key: (voting?.key || '') as string,
          startDate: formatDateTimeToTime(voting?.startDate) || '',
          targetBudgetInGwei: Number(voting?.budget) / GWEI_TO_WEI,
          contentIpfsHash: voting?.contentIpfsHash || '',
          approved: !!voting?.approved,
          canApprove:
          Number(voting?.startDate) - _approveMaxTimeBeforeVotingStarts < now
          && now < Number(voting?.startDate),
          minTotalCheckQuizAnswers: _minTotalCheckQuizAnswers,
          numOfAssignedAnswers: (_numOfAssignedAnswers || 0),
          contentCheckQuizIpfsHash: (voting?.votingContentCheckQuizIpfsHash || ''),
          approveMaxTimeBeforeVotingStarts: _approveMaxTimeBeforeVotingStarts
        });

        if (voting?.votingContentCheckQuizIpfsHash) {
          setContentIpfsHashInput(voting?.votingContentCheckQuizIpfsHash);
        }
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

  const assignIpfsContentCheckToVoting = async () => {
    if (votingInfo?.key && contentIpfsHashInput) {
      await asyncErrWrapper(assignQuizIpfsHashToVoting)(votingInfo?.key, contentIpfsHashInput);
      setVotingInfo({
        ...votingInfo,
        contentCheckQuizIpfsHash: contentIpfsHashInput
      });
      showSuccessToast('Ipfs content check successfully assigned to voting');
    }
  };

  const assignAnswersToVoting = async () => {
    const hashAnswers = answers.map((answer) => toBytes32ToKeccak256(answer));
    if (votingInfo?.key && hashAnswers.length >= (votingInfo?.minTotalCheckQuizAnswers || 1)) {
      await asyncErrWrapper(addAnswersToVotingContent)(votingInfo?.key, hashAnswers);
      setVotingInfo({
        ...votingInfo,
        numOfAssignedAnswers: hashAnswers.length
      });
      showSuccessToast('Answers successfully assigned to voting');
    }
  };

  const approveVotingAction = async () => {
    if (
      !votingInfo?.approved
      && votingInfo?.key
      && votingInfo?.contentCheckQuizIpfsHash
      && Number(votingInfo?.numOfAssignedAnswers) >= Number(votingInfo?.minTotalCheckQuizAnswers)
    ) {
      await asyncErrWrapper(approveVoting)(votingInfo?.key);
      setVotingInfo({
        ...votingInfo,
        approved: true
      });
      showSuccessToast('Voting successfully approved');
    }
  };

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
                {votingInfo?.key && (
                <Stack spacing={2}>
                  <LabelComponent label="Approved:" component={<YesNoText text={votingInfo.approved ? 'yes' : 'no'} />} />
                  <LabelText label="Approve deadline:" text={votingInfo.startDate} />
                  <LabelText label="Target budget (gwei):" text={votingInfo.targetBudgetInGwei} />
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
                  {!votingInfo?.contentCheckQuizIpfsHash && (
                  <IpfsFileUpload
                    fileInfo={fileInfo}
                    setFileInfo={setFileInfo}
                    setFieldValue={setFieldValue}
                    setInputFieldValue={setContentIpfsHashInput}
                  />
                  )}
                  <Field
                    as={TextField}
                    name="contentIpfsHash"
                    label="Content ipfs hash reference"
                    value={contentIpfsHashInput}
                    disabled={!!votingInfo?.contentCheckQuizIpfsHash}
                    fullWidth
                    error={touched.contentIpfsHash && !!errors.contentIpfsHash}
                    helperText={touched.contentIpfsHash && errors.contentIpfsHash}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFieldValue('contentIpfsHash', e.target.value);
                      setContentIpfsHashInput(e.target.value);
                    }}
                  />
                  <Stack spacing={2} direction="row">
                    <PdfIpfsContentViewer ipfsHash={values.contentIpfsHash || votingInfo?.contentCheckQuizIpfsHash || ''} />
                    <Button color="info" disabled={!values.contentIpfsHash} onClick={assignIpfsContentCheckToVoting} variant="contained">ASSIGN IPFS HASH TO VOTING</Button>
                  </Stack>
                  <SubTitle text="Assign answers" />
                  {votingInfo?.contentCheckQuizIpfsHash && !votingInfo?.numOfAssignedAnswers
                    && (
                      <Stack spacing={2}>
                        <QuizQuestionEditor
                          answers={answers}
                          setAnswers={setAnswers}
                          minAnswersRequired={Number(votingInfo?.minTotalCheckQuizAnswers)}
                        />
                        <Button color="info" onClick={assignAnswersToVoting} disabled={answers.length < (votingInfo.minTotalCheckQuizAnswers || 50)} variant="contained">
                          ASSIGN ANSWERS TO VOTING
                        </Button>
                      </Stack>
                    )}
                  {votingInfo?.contentCheckQuizIpfsHash && votingInfo?.numOfAssignedAnswers
                    && (
                      <LabelText label="Number of assigned answers:" text={votingInfo?.numOfAssignedAnswers} />
                    )}
                  {!votingInfo?.contentCheckQuizIpfsHash && <Alert severity="info">IPFS content check quiz hash has to be assigned before</Alert>}
                  {!votingInfo?.canApprove && (
                    <Stack>
                      <Alert severity="info">Voting can be approved between:
                        {`${formatDateTimeToTime(Number(votingInfo.oVoting?.startDate) - Number(votingInfo.approveMaxTimeBeforeVotingStarts))}`} and
                        {`${formatDateTimeToTime(Number(votingInfo.oVoting?.startDate))}`}
                      </Alert>
                    </Stack>
                  )}
                  <Stack>
                    <Button
                      disabled={
                        !votingInfo?.canApprove
                        || votingInfo?.approved
                        || !votingInfo?.contentCheckQuizIpfsHash
                        || Number(votingInfo?.minTotalCheckQuizAnswers)
                        > Number(votingInfo?.numOfAssignedAnswers)
                      }
                      onClick={approveVotingAction}
                      color="success"
                      variant="contained"
                    >
                      APPROVE
                    </Button>
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
