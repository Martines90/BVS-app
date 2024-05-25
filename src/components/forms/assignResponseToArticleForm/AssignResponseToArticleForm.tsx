import {
  Box, Button, Stack, TextField
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

import Label from '@components/general/Label/Label';
import LabelComponent from '@components/general/LabelComponent/LabelComponent';
import SubTitle from '@components/general/SubTitle/SubTitle';
import YesNoText from '@components/general/YesNoText/YesNoText';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';
import PdfIpfsContentViewer from '@components/pdfIpfsContentViewer/PdfIpfsContentViewer';
import { showSuccessToast } from '@components/toasts/Toasts';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { useLocation } from 'react-router-dom';
import IpfsFileUpload, { FileInfo } from '../components/IpfsFileUpload';

type ArticleInfo = {
  key?: string;
  articleApproved?: boolean;
  responseApproved?: boolean;
  responseStatementIpfsHash?: string;
  articleContentIpfsHash?: string;
  numOfResponsePublishCreditsLeft?: number;
};

const formInitialValues = {
  contentIpfsHash: '',
  isVoteOnA: true
};

const AssignResponseToArticleForm = () => {
  const { hash } = useLocation();
  const {
    getArticleAtKey,
    assignResponseIpfsHashToArticle
  } = useContract();

  const urlParams = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');

  const [votingKey, setVotingKey] = useState(urlParams.get('voting_key') || '');
  const [articleKey, setArticleKey] = useState(urlParams.get('article_key') || '');
  const [isLoading, setIsLoading] = useState(true);
  const [votingKeyFieldVal, setVotingKeyFieldVal] = useState(votingKey);
  const [articleKeyFieldVal, setArticleKeyFieldVal] = useState(articleKey);
  const [articleInfo, setArticleInfo] = useState<ArticleInfo>();
  const [fileInfo, setFileInfo] = useState<FileInfo>({});
  const [responseIpfsHashInput, setResponseIpfsHashInput] = useState('');

  const loadAssignedResponses = async () => {
    if (articleKey && votingKey) {
      const article = await asyncErrWrapper(getArticleAtKey)(votingKey, articleKey);

      setArticleInfo({
        key: articleKey,
        articleContentIpfsHash: article?.articleIpfsHash,
        responseStatementIpfsHash: article?.responseStatementIpfsHash || '',
        articleApproved: article?.isArticleApproved,
        responseApproved: article?.isResponseApproved
      });

      setResponseIpfsHashInput(article?.responseStatementIpfsHash || '');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAssignedResponses();
  }, [articleKey, votingKey]);

  const loadArticle = () => {
    setArticleKey(articleKeyFieldVal);
    setVotingKey(votingKeyFieldVal);
  };

  if (isLoading) {
    return <CommunicationWithContractIsInProgressLoader />;
  }

  return (
    <FormContainer css={{ maxWidth: 1000, width: 1000 }}>
      <FormTitle>Assign response to article</FormTitle>
      <Formik
        initialValues={formInitialValues}
        onSubmit={async (values) => {
          asyncErrWrapper(assignResponseIpfsHashToArticle)(
            votingKey,
            articleKey,
            values.contentIpfsHash
          ).then(() => {
            showSuccessToast('You have successfully assigned new response to article');
            setArticleInfo({
              ...articleInfo,
              responseStatementIpfsHash: values.contentIpfsHash
            });
          });
        }}
      >
        {({
          setFieldValue, values, handleChange
        }) => (
          <Form>
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
              {articleInfo?.key && (
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <Stack spacing={2}>
                      <LabelComponent
                        label="Article approved"
                        component={
                          <YesNoText text={articleInfo?.articleApproved ? 'yes' : 'no'} />
                      }
                      />
                      <LabelComponent
                        label="Article response approved"
                        component={
                          <YesNoText text={articleInfo?.responseApproved ? 'yes' : 'no'} />
                      }
                      />
                    </Stack>
                    <Stack spacing={2}>
                      <LabelComponent
                        label="Has assigned response"
                        component={
                          <YesNoText text={articleInfo?.responseStatementIpfsHash !== '' ? 'yes' : 'no'} />
                    }
                      />
                      <LabelComponent
                        label="View article content"
                        component={(
                          <PdfIpfsContentViewer
                            ipfsHash={articleInfo?.articleContentIpfsHash || ''}
                            css={{ fontSize: '12px', padding: '0' }}
                          />
                        )}
                      />
                    </Stack>
                  </Stack>
                  <SubTitle text="Assign response" />
                  <IpfsFileUpload
                    fileInfo={fileInfo}
                    setFileInfo={setFileInfo}
                    setFieldValue={setFieldValue}
                    setInputFieldValue={setResponseIpfsHashInput}
                  />
                  <Field
                    as={TextField}
                    name="contentIpfsHash"
                    label="Content ipfs hash reference"
                    value={responseIpfsHashInput}
                    disabled={!!articleInfo?.responseStatementIpfsHash}
                    fullWidth
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setFieldValue('contentIpfsHash', e.target.value);
                      setResponseIpfsHashInput(e.target.value);
                    }}
                  />
                  <PdfIpfsContentViewer ipfsHash={values.contentIpfsHash || ''} />
                  <Box textAlign="center">
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={!values.contentIpfsHash || !!articleInfo?.responseStatementIpfsHash}
                    >
                      ASSIGN
                    </Button>
                  </Box>
                </Stack>
              )}
            </Stack>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default AssignResponseToArticleForm;
