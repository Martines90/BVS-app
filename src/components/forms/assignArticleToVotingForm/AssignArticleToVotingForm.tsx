import {
  Box, Button, FormControlLabel, Stack, Switch, TextField, Typography
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';

import DataTable from '@components/general/DataTable/DataTable';
import LabelText from '@components/general/LabelText/LabelText';
import SubTitle from '@components/general/SubTitle/SubTitle';
import { CommunicationWithContractIsInProgressLoader } from '@components/loaders/Loaders';
import PdfIpfsContentViewer from '@components/pdfIpfsContentViewer/PdfIpfsContentViewer';
import { showSuccessToast } from '@components/toasts/Toasts';
import { getVotingKeyFromHash } from '@global/helpers/routing';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { ProConArticle } from '@hooks/contract/types';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import { useLocation } from 'react-router-dom';
import IpfsFileUpload, { FileInfo } from '../components/IpfsFileUpload';

export type ProConArticleData = {
  articleKey: string;
  contentIpfsHash: string;
  voteOnA: 'yes' | 'no';
  approved: 'yes' | 'no';
  viewBtnLink: string;
};

type VotingInfo = {
  key?: string;
  contentIpfsHash?: string;
  proConArticles?: ProConArticle[];
  numOfArticlePublishCreditsLeft?: number;
};

type UserInfo = {
  totalCredits?: number;
};

const formInitialValues = {
  contentIpfsHash: '',
  isVoteOnA: true
};

const AssignArticleToVotingForm = () => {
  const { hash } = useLocation();
  const {
    getVotingAssignedArticlesPublishedByAccount,
    getPoliticalActorVotingCredits,
    getPoliticalActorPublishArticleToVotingsCount,
    assignArticleToVoting
  } = useContract();
  const { userState } = useUserContext();
  const [votingKey, setVotingKey] = useState(getVotingKeyFromHash(hash));
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [proConArticlesData, setProConArticlesData] = useState<ProConArticleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingKeyFieldVal, setVotingKeyFieldVal] = useState(votingKey);
  const [votingInfo, setVotingInfo] = useState<VotingInfo>();
  const [fileInfo, setFileInfo] = useState<FileInfo>({});

  useEffect(() => {
    const loadUserInfo = async () => {
      const _totalCredits = await asyncErrWrapper(getPoliticalActorVotingCredits)(userState.walletAddress || '') || 0;

      setUserInfo({
        totalCredits: _totalCredits
      });
    };

    loadUserInfo();
  }, []);

  const loadAssignedArticles = async () => {
    if (votingKey) {
      const articles = await asyncErrWrapper(getVotingAssignedArticlesPublishedByAccount)(
        votingKey,
        userState.walletAddress || ''
      ) || [];

      const numberOfArticlesPublished = await asyncErrWrapper(
        getPoliticalActorPublishArticleToVotingsCount
      )(
        userState.walletAddress || '',
        votingKey
      ) || 0;

      setVotingInfo({
        key: votingKey,
        proConArticles: articles,
        numOfArticlePublishCreditsLeft: (userInfo?.totalCredits || 0) - numberOfArticlesPublished
      });

      setProConArticlesData(articles.map((article) => ({
        articleKey: String(article.articleKey),
        contentIpfsHash: article.articleIpfsHash,
        voteOnA: article.isVoteOnA ? 'yes' : 'no',
        approved: article.isArticleApproved ? 'yes' : 'no',
        viewBtnLink: `/articles#article?article_key=${article.articleKey}`
      })));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAssignedArticles();
  }, [votingKey]);

  const loadVotingInfo = async () => {
    setVotingKey(votingKeyFieldVal);
  };

  if (isLoading) {
    return <CommunicationWithContractIsInProgressLoader />;
  }

  return (
    <FormContainer css={{ maxWidth: 1000, width: 1000 }}>
      <FormTitle>Assign pro/con articles to voting</FormTitle>
      <Formik
        initialValues={formInitialValues}
        onSubmit={async (values) => {
          asyncErrWrapper(assignArticleToVoting)(
            votingKey,
            values.contentIpfsHash,
            values.isVoteOnA
          ).then(() => {
            showSuccessToast('You have successfully assigned new article to voting');
            loadAssignedArticles();
          });
        }}
      >
        {({
          setFieldValue, values, handleChange
        }) => (
          <Form>
            <Stack spacing={2}>
              <LabelText
                label="Total number of publish credits:"
                text={`${userInfo?.totalCredits}`}
              />
              <Stack direction="row" spacing={2}>
                <Typography sx={{
                  minWidth: '130px',
                  fontWeight: 'bold',
                  lineHeight: '50px',
                  display: 'table-cell'
                }}
                >
                  Voting key:
                </Typography>
                <TextField
                  name="voting-key"
                  fullWidth
                  value={votingKeyFieldVal}
                  onChange={
                          (e) => { setVotingKeyFieldVal(e.target.value); }
                        }
                />
                <Button sx={{ minWidth: '200px' }} variant="contained" onClick={() => loadVotingInfo()}>
                  LOAD VOTING
                </Button>
              </Stack>
              {votingInfo?.key && (
              <Stack spacing={2}>
                <LabelText
                  label="Number of voting credits left:"
                  text={`${userInfo?.totalCredits}/${votingInfo?.numOfArticlePublishCreditsLeft}`}
                />
                <SubTitle text="Articles assigned by you" />
                <DataTable
                  popoverDisplayFields={['articleKey', 'contentIpfsHash']}
                  tableHeadFields={['Article Key', 'Content IPFS hash', 'Vote on A (yes)', 'Approved']}
                  handlePageChange={() => {}}
                  data={proConArticlesData}
                  currentPage={1}
                  isLoadingData={false}
                />
                <SubTitle text="Assign new pro/con article" />
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                    setFieldValue('contentIpfsHash', e.target.value);
                  }}
                />
                <PdfIpfsContentViewer ipfsHash={values.contentIpfsHash || ''} />
                <FormControlLabel
                  control={
                    <Switch name="isVoteOnA" checked={values.isVoteOnA} onChange={handleChange('isVoteOnA')} />
                  }
                  label="Support vote on A (Yes)"
                />
                <Box textAlign="center">
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!values.contentIpfsHash || !!votingInfo?.contentIpfsHash}
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

export default AssignArticleToVotingForm;
