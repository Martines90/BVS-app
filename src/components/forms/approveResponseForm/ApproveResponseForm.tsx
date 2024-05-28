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
  contentIpfsHash?: string;
  responseContentCheckQuizIpfsHash?: string;
  articleApproved?: boolean;
  responseApproved?: boolean;
  responseIpfsHash?: string;
  numOfAssignedResponseAnswers?: number;
  minTotalResponseCheckQuizAnswers?: number;
};

type InitialValues = {
  contentIpfsHash: string
};

const formInitialValues: InitialValues = {
  contentIpfsHash: ''
};

const ApproveResponseForm = () => {
  const { hash } = useLocation();
  const {
    getArticleAtKey,
    addAnswersToResponseContent,
    assignQuizIpfsHashToResponse,
    getArticleResponseContentReadCheckAnswersLength,
    getMinTotalQuizCheckAnswers
  } = useContract();
  const [answers, setAnswers] = useState<string[]>([]);
  const [contentIpfsHashInput, setContentIpfsHashInput] = useState('');

  const [fileInfo, setFileInfo] = useState<FileInfo>({});

  const urlParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');

  const [articleKey, setArticleKey] = useState(urlParams.get('article_key') || '');
  const [votingKey, setVotingKey] = useState(urlParams.get('voting_key') || '');
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
          getArticleResponseContentReadCheckAnswersLength
        )(articleKey);

        setArticleInfo({
          key: (article?.articleKey || '') as string,
          contentIpfsHash: article?.articleIpfsHash || '',
          minTotalResponseCheckQuizAnswers: _minTotalCheckQuizAnswers,
          numOfAssignedResponseAnswers: (_numOfAssignedAnswers || 0),
          responseIpfsHash: (article?.responseStatementIpfsHash || ''),
          responseContentCheckQuizIpfsHash: (article?.responseContentCheckQuizIpfsHash || ''),
          responseApproved: article?.isResponseApproved
        });

        if (article?.responseContentCheckQuizIpfsHash) {
          setContentIpfsHashInput(article?.responseContentCheckQuizIpfsHash);
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

  const assignResponseIpfsContentCheckToArticle = async () => {
    if (votingKey && articleInfo?.key && contentIpfsHashInput) {
      asyncErrWrapper(assignQuizIpfsHashToResponse)(
        votingKey,
        articleInfo?.key,
        contentIpfsHashInput
      ).then(() => {
        setArticleInfo({
          ...articleInfo,
          responseContentCheckQuizIpfsHash: contentIpfsHashInput
        });
        showSuccessToast('Ipfs content check successfully assigned to response');
      });
    }
  };

  const assignAnswersToResponse = async () => {
    const hashAnswers = answers.map((answer) => toBytes32ToKeccak256(answer));
    if (
      votingKey
      && articleInfo?.key
      && hashAnswers.length >= (articleInfo?.minTotalResponseCheckQuizAnswers || 1)
    ) {
      asyncErrWrapper(addAnswersToResponseContent)(votingKey, articleInfo?.key, hashAnswers).then(
        () => {
          setArticleInfo({
            ...articleInfo,
            numOfAssignedResponseAnswers: hashAnswers.length,
            responseApproved: true
          });
          showSuccessToast('Answers successfully assigned to response');
        }
      );
    }
  };

  return (
    <FormContainer css={{ maxWidth: 1000, width: 1000 }}>
      <FormTitle>Approve article response</FormTitle>
      <LoadContent condition={!articleInfo}>
        <Formik
          initialValues={formInitialValues}
          onSubmit={() => {}}
        >
          {({
            setFieldValue, values, errors, touched, handleChange
          }) => (
            <Form>
              <Stack spacing={2}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <Label text="Voting key:" css={{ minWidth: '120px' }} />
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
                    <Label text="Article Key:" css={{ minWidth: '120px' }} />
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
                {articleInfo?.responseIpfsHash === '' && (
                <Alert severity="info">
                  There is no response assigned to this article.
                </Alert>
                )}
                {articleInfo?.key && articleInfo?.responseIpfsHash !== '' && (
                <Stack spacing={2}>
                  <LabelComponent label="Response approved:" component={<YesNoText text={articleInfo.responseApproved ? 'yes' : 'no'} />} />
                  <ToggleList
                    listItemComponents={[
                      {
                        labelText: 'Response content description',
                        component: <PdfViewer documentUrl={`${IPFS_GATEWAY_URL}/${articleInfo.responseIpfsHash}`} />,
                        icon: <ArticleIcon />
                      }
                    ]}
                  />
                  <SubTitle text="Assign IPFS Quiz hash" />
                  {!articleInfo?.responseContentCheckQuizIpfsHash && (
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
                    disabled={!!articleInfo?.responseContentCheckQuizIpfsHash}
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
                    <PdfIpfsContentViewer ipfsHash={values.contentIpfsHash || articleInfo?.responseContentCheckQuizIpfsHash || ''} />
                    <Button color="info" disabled={!values.contentIpfsHash} onClick={assignResponseIpfsContentCheckToArticle} variant="contained">ASSIGN IPFS HASH TO RESPONSE</Button>
                  </Stack>
                  <SubTitle text="Assign answers" />
                  {
                    articleInfo?.responseContentCheckQuizIpfsHash
                    && !articleInfo?.numOfAssignedResponseAnswers
                    && (
                      <Stack spacing={2}>
                        <QuizQuestionEditor
                          answers={answers}
                          setAnswers={setAnswers}
                          minAnswersRequired={Number(articleInfo?.minTotalResponseCheckQuizAnswers)}
                        />
                        <Button color="info" onClick={assignAnswersToResponse} disabled={answers.length < (articleInfo.minTotalResponseCheckQuizAnswers || 50)} variant="contained">
                          ASSIGN ANSWERS TO RESPONSE
                        </Button>
                      </Stack>
                    )
                  }
                  {
                  articleInfo?.responseContentCheckQuizIpfsHash
                  && articleInfo?.numOfAssignedResponseAnswers
                    && (
                      <LabelText label="Number of assigned answers:" text={articleInfo?.numOfAssignedResponseAnswers} />
                    )
                  }
                  {!articleInfo?.responseContentCheckQuizIpfsHash && <Alert severity="info">IPFS content check quiz hash has to be assigned before</Alert>}
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

export default ApproveResponseForm;
