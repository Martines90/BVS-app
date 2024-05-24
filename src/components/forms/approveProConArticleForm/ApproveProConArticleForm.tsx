import ToggleList from '@components/ToggleList/ToggleList';
import LoadContent from '@components/general/Loaders/LoadContent';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';
import PdfViewer from '@components/pdfViewer/PdfViewer';
import { IPFS_GATEWAY_URL } from '@global/constants/general';
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

import QuizQuestionEditor from '@components/QuizQuestionEditor/QuizQuestionsEditor';
import Label from '@components/general/Label/Label';
import LabelComponent from '@components/general/LabelComponent/LabelComponent';
import LabelText from '@components/general/LabelText/LabelText';
import SubTitle from '@components/general/SubTitle/SubTitle';
import YesNoText from '@components/general/YesNoText/YesNoText';
import PdfIpfsContentViewer from '@components/pdfIpfsContentViewer/PdfIpfsContentViewer';
import { showSuccessToast } from '@components/toasts/Toasts';
import { toBytes32ToKeccak256 } from '@global/helpers/hash-manipulation';
import ArticleIcon from '@mui/icons-material/Article';
import IpfsFileUpload, { FileInfo } from '../components/IpfsFileUpload';

type ArticleInfo = {
  key?: string;
  publisher?: string;
  contentIpfsHash?: string;
  contentCheckQuizIpfsHash?: string;
  approved?: boolean;
  numOfAssignedAnswers?: number;
  minTotalCheckQuizAnswers?: number;
  approveMaxTimeBeforeArticleStarts?: number;
};

type InitialValues = {
  contentIpfsHash: string
};

const formInitialValues: InitialValues = {
  contentIpfsHash: ''
};

const ApproveProConArticleForm = () => {
  const { hash } = useLocation();
  const {
    getArticleAtKey,
    addAnswersToArticleContent,
    assignQuizIpfsHashToArticle,
    getArticleContentReadCheckAnswersLength,
    getMinTotalQuizCheckAnswers
  } = useContract();
  const [answers, setAnswers] = useState<string[]>([]);
  const [contentIpfsHashInput, setContentIpfsHashInput] = useState('');

  const [fileInfo, setFileInfo] = useState<FileInfo>({});

  const urlParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');

  const [articleKey, setArticleKey] = useState(urlParams.get('article_key'));
  const [votingKey, setVotingKey] = useState(urlParams.get('voting_key'));
  const [articleKeyFieldVal, setArticleKeyFieldVal] = useState(articleKey);
  const [votingKeyFieldVal, setVotingKeyFieldVal] = useState(votingKey);
  const [articleInfo, setArticleInfo] = useState<ArticleInfo>();
  const [isLoading, setIsLoading] = useState(true);

  const loadArticle = () => {
    setArticleKey(articleKeyFieldVal);
    setVotingKey(votingKeyFieldVal);
  };

  useEffect(() => {
    const loadArticleInfo = async () => {
      if (articleKey && votingKey) {
        const article = await asyncErrWrapper(getArticleAtKey)(votingKey, articleKey);
        const _minTotalCheckQuizAnswers = await asyncErrWrapper(getMinTotalQuizCheckAnswers)();
        const _numOfAssignedAnswers = await asyncErrWrapper(
          getArticleContentReadCheckAnswersLength
        )(articleKey);

        setArticleInfo({
          key: (article?.articleKey || '') as string,
          contentIpfsHash: article?.articleIpfsHash || '',
          minTotalCheckQuizAnswers: _minTotalCheckQuizAnswers,
          numOfAssignedAnswers: (_numOfAssignedAnswers || 0),
          contentCheckQuizIpfsHash: (article?.articleContentCheckQuizIpfsHash || '')
        });

        if (article?.articleContentCheckQuizIpfsHash) {
          setContentIpfsHashInput(article?.articleContentCheckQuizIpfsHash);
        }
      } else {
        setArticleInfo({});
      }
      setIsLoading(false);
    };

    loadArticleInfo();
  }, [articleKey, votingKey]);

  if (isLoading) {
    return <CommunicationWithContractIsInProgressLoader />;
  }

  const assignIpfsContentCheckToArticle = async () => {
    if (votingKey && articleInfo?.key && contentIpfsHashInput) {
      await asyncErrWrapper(assignQuizIpfsHashToArticle)(
        votingKey,
        articleInfo?.key,
        contentIpfsHashInput
      );
      setArticleInfo({
        ...articleInfo,
        contentCheckQuizIpfsHash: contentIpfsHashInput
      });
      showSuccessToast('Ipfs content check successfully assigned to article');
    }
  };

  const assignAnswersToArticle = async () => {
    const hashAnswers = answers.map((answer) => toBytes32ToKeccak256(answer));
    if (
      votingKey
      && articleInfo?.key
      && hashAnswers.length >= (articleInfo?.minTotalCheckQuizAnswers || 1)
    ) {
      await asyncErrWrapper(addAnswersToArticleContent)(votingKey, articleInfo?.key, hashAnswers);
      setArticleInfo({
        ...articleInfo,
        numOfAssignedAnswers: hashAnswers.length,
        approved: true
      });
      showSuccessToast('Answers successfully assigned to article');
    }
  };

  return (
    <FormContainer css={{ maxWidth: 1000, width: 1000 }}>
      <FormTitle>Approve article</FormTitle>
      <LoadContent condition={!articleInfo}>
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
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <Label text="Voting key:" />
                    <TextField
                      name="voting-key"
                      fullWidth
                      value={votingKeyFieldVal}
                      onChange={
                          (e) => { setVotingKeyFieldVal(e.target.value); }
                        }
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Label text="Article Key:" />
                    <TextField
                      name="article-key"
                      fullWidth
                      value={articleKeyFieldVal}
                      onChange={
                          (e) => { setArticleKeyFieldVal(e.target.value); }
                        }
                    />
                    <Button sx={{ width: '200px' }} variant="contained" onClick={() => loadArticle()}>LOAD ARTICLE</Button>
                  </Stack>
                </Stack>
                {articleInfo?.key === '' && (
                <Alert severity="info">
                  There is no existing article under this key.
                </Alert>
                )}
                {articleInfo?.key && (
                <Stack spacing={2}>
                  <LabelComponent label="Approved:" component={<YesNoText text={articleInfo.approved ? 'yes' : 'no'} />} />
                  <ToggleList
                    listItemComponents={[
                      {
                        labelText: 'Article content description',
                        component: <PdfViewer documentUrl={`${IPFS_GATEWAY_URL}/${articleInfo.contentIpfsHash}`} />,
                        icon: <ArticleIcon />
                      }
                    ]}
                  />
                  <SubTitle text="Assign IPFS Quiz hash" />
                  {!articleInfo?.contentCheckQuizIpfsHash && (
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
                    disabled={!!articleInfo?.contentCheckQuizIpfsHash}
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
                    <PdfIpfsContentViewer ipfsHash={values.contentIpfsHash || articleInfo?.contentCheckQuizIpfsHash || ''} />
                    <Button color="info" disabled={!values.contentIpfsHash} onClick={assignIpfsContentCheckToArticle} variant="contained">ASSIGN IPFS HASH TO VOTING</Button>
                  </Stack>
                  <SubTitle text="Assign answers" />
                  {articleInfo?.contentCheckQuizIpfsHash && !articleInfo?.numOfAssignedAnswers
                    && (
                      <Stack spacing={2}>
                        <QuizQuestionEditor
                          answers={answers}
                          setAnswers={setAnswers}
                          minAnswersRequired={Number(articleInfo?.minTotalCheckQuizAnswers)}
                        />
                        <Button color="info" onClick={assignAnswersToArticle} disabled={answers.length < (articleInfo.minTotalCheckQuizAnswers || 50)} variant="contained">
                          ASSIGN ANSWERS TO ARTICLE
                        </Button>
                      </Stack>
                    )}
                  {articleInfo?.contentCheckQuizIpfsHash && articleInfo?.numOfAssignedAnswers
                    && (
                      <LabelText label="Number of assigned answers:" text={articleInfo?.numOfAssignedAnswers} />
                    )}
                  {!articleInfo?.contentCheckQuizIpfsHash && <Alert severity="info">IPFS content check quiz hash has to be assigned before</Alert>}
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

export default ApproveProConArticleForm;
