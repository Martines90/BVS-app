/* eslint-disable max-lines */
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
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import FormTitle from '../components/FormTitle';
import ContentCheckQuizForm from '../contentCheckQuizForm/ContentCheckQuizForm';

import LabelComponent from '@components/general/LabelComponent/LabelComponent';
import SubTitle from '@components/general/SubTitle/SubTitle';
import YesNoText from '@components/general/YesNoText/YesNoText';
import { showSuccessToast } from '@components/toasts/Toasts';
import { ProConArticleExt, VotingInfo } from '@components/types/Types';
import { getVotingKeyFromHash } from '@global/helpers/routing';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import ArticleIcon from '@mui/icons-material/Article';
import QuizIcon from '@mui/icons-material/Quiz';
import { BytesLike } from 'ethers';

const VotingForm = () => {
  const { hash } = useLocation();
  const { userState } = useUserContext();
  const {
    getVotingAtKey,
    getAccountVotingScore,
    getAccountVotingRelatedQuestionIndexes,
    getAccountArticleRelatedQuestionIndexes,
    getAccountArticleResponseRelatedQuestionIndexes,
    getVotingDuration,
    getVotingAssignedArticlesPublished,
    getAccountVote,
    voteOnVoting,
    completeVotingContentCheckQuiz,
    completeArticleContentCheckQuiz,
    completeArticleResponseContentCheckQuiz
  } = useContract();

  const [votingKey, setVotingKey] = useState(getVotingKeyFromHash(hash));
  const [votingKeyFieldVal, setVotingKeyFieldVal] = useState(votingKey);
  const [votingInfo, setVotingInfo] = useState<VotingInfo | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const now = getNow();

  const loadVoting = () => {
    setVotingKey(votingKeyFieldVal);
  };

  const loadVotingInfo = async () => {
    if (votingKey) {
      const voting = await asyncErrWrapper(getVotingAtKey)(votingKey);
      const vote = await asyncErrWrapper(getAccountVote)(votingKey, userState.walletAddress || '');
      const accountVotingScore = await asyncErrWrapper(getAccountVotingScore)(
        voting?.key || '',
        userState.walletAddress || ''
      );
      const votingDuration = await asyncErrWrapper(getVotingDuration)() || 0;

      const articles = await Promise.all(
        (await asyncErrWrapper(getVotingAssignedArticlesPublished)(
          votingKey
        ) || []).map(async (_article) => {
          let articleContentCheckQuestionIndexes: number[] = [];
          let articleResponseCheckQuestionIndexes: number[] = [];

          if (_article?.articleContentCheckQuizIpfsHash !== '') {
            // FIX ME
            articleContentCheckQuestionIndexes = await asyncErrWrapper(
              getAccountArticleRelatedQuestionIndexes
            )(voting?.key || '', _article.articleKey, userState.walletAddress || '') || [];
          }

          if (_article?.responseContentCheckQuizIpfsHash !== '') {
            // FIX ME
            articleResponseCheckQuestionIndexes = await asyncErrWrapper(
              getAccountArticleResponseRelatedQuestionIndexes
            )(voting?.key || '', _article.articleKey, userState.walletAddress || '') || [];
          }

          return {
            ..._article,
            articleContentCheckQuestionIndexes,
            articleResponseCheckQuestionIndexes
          } as ProConArticleExt;
        })
      );

      let _accountQuestionIndexes: number[] = [];
      if (voting?.votingContentCheckQuizIpfsHash !== '') {
        // eslint-disable-next-line max-len
        // FIXME : there is zero division at getAccountQuizAnswerIndexes call cause of votingContentReadCheckAnswers[_votingKey].length
        _accountQuestionIndexes = await asyncErrWrapper(
          getAccountVotingRelatedQuestionIndexes
        )(voting?.key || '', userState.walletAddress || '') || [];
      }

      const isVotingActive = now > (
        voting?.startDate || 0) && now < (voting?.startDate || 0) + votingDuration;

      setVotingInfo({
        key: (voting?.key || '') as string,
        startDate: formatDateTime(voting?.startDate) || '',
        contentIpfsHash: voting?.contentIpfsHash || '',
        contentCheckQuizIpfsHash: voting?.votingContentCheckQuizIpfsHash || '',
        approved: !!voting?.approved,
        relatedVotingScore: accountVotingScore || 0,
        active: isVotingActive,
        proConArticles: articles,
        numberOfVotes: voting?.voteCount || 0,
        voteOnAScore: voting?.voteOnAScore || 0,
        voteOnBScore: voting?.voteOnBScore || 0,
        vote,
        votingContentCheckQuizIndexes: _accountQuestionIndexes
      });
    } else {
      setVotingInfo(undefined);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadVotingInfo();
  }, [votingKey]);

  const completeVotingQuiz = async (answers: string[]) => {
    await asyncErrWrapper(completeVotingContentCheckQuiz)(
      votingInfo?.key || '',
      answers
    ).then(() => {
      setVotingInfo({
        ...votingInfo,
        vote: {
          ...votingInfo?.vote,
          isContentQuizCompleted: true
        }
      });
      showSuccessToast('Voting quiz successfully completed');
    });
  };

  const completeArticleQuiz = async (articleKey: BytesLike, answers: string[]) => {
    await asyncErrWrapper(completeArticleContentCheckQuiz)(
      votingInfo?.key || '',
      articleKey,
      answers
    ).then(() => {
      showSuccessToast('Article quiz successfully completed');
      loadVotingInfo();
    });
  };

  const completeArticleResponseQuiz = async (articleKey: BytesLike, answers: string[]) => {
    await asyncErrWrapper(completeArticleResponseContentCheckQuiz)(
      votingInfo?.key || '',
      articleKey,
      answers
    ).then(() => {
      showSuccessToast('Response quiz successfully completed');
      loadVotingInfo();
    });
  };

  const vote = async (voteOnA: boolean) => {
    await asyncErrWrapper(voteOnVoting)(votingInfo?.key || '', voteOnA).then(() => {
      showSuccessToast('You have successfully voted');
      setVotingInfo({
        ...votingInfo,
        vote: {
          ...votingInfo?.vote,
          voted: true
        }
      });
    });
  };

  if (isLoading) {
    return <CommunicationWithContractIsInProgressLoader />;
  }

  const canVote = votingInfo?.active
    && votingInfo?.approved
    && votingInfo.vote?.isContentQuizCompleted
    && !votingInfo.vote?.voted;

  return (
    <FormContainer css={{ maxWidth: 1000, width: 1000 }}>
      <FormTitle>Voting</FormTitle>
      <LoadContent condition={isLoading}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Typography sx={{
              fontWeight: 'bold',
              lineHeight: '50px',
              display: 'table-cell'
            }}
            >Key:
            </Typography>
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
          {!!votingInfo && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={10}>
              <Stack>
                <LabelText label="Start date:" text={votingInfo.startDate} />
                <LabelComponent label="Approved:" component={<YesNoText text={votingInfo.approved ? 'yes' : 'no'} />} />
                <LabelComponent label="Active:" component={<YesNoText text={votingInfo.active ? 'yes' : 'no'} />} />
                <LabelComponent label="Content check quiz completed:" component={<YesNoText text={votingInfo.vote?.isContentQuizCompleted ? 'yes' : 'no'} />} />
              </Stack>
              <Stack>
                <LabelText label="Total number of votes:" text={votingInfo.numberOfVotes} />
                <LabelText label='Score on "Yes":' text={votingInfo.voteOnAScore} />
                <LabelText label='Score on "No":' text={votingInfo.voteOnBScore} />
                <LabelComponent label="Voted:" component={<YesNoText text={votingInfo.vote?.voted ? 'yes' : 'no'} />} />
              </Stack>
            </Stack>
            <LabelText label="Your voting score:" text={votingInfo.relatedVotingScore} />
            <SubTitle text="Voting content" />
            <ToggleList
              listItemComponents={[
                {
                  labelText: 'Voting content description',
                  component: <PdfViewer documentUrl={`${IPFS_GATEWAY_URL}/${votingInfo.contentIpfsHash}`} />,
                  icon: <ArticleIcon />
                },
                {
                  labelText: `Voting content check quiz${votingInfo.contentCheckQuizIpfsHash ? '' : ' (not assigned yet)'}`,
                  component:
  <ContentCheckQuizForm
    quizIpfsHash={votingInfo.contentCheckQuizIpfsHash || ''}
    accountQuestionIndexes={votingInfo.votingContentCheckQuizIndexes || []}
    completeVotingQuizFn={completeVotingQuiz}
  />,
                  icon: <QuizIcon />
                }
              ]}
            />
            <SubTitle text="Assigned pro/con articles & responses" />
            <ToggleList
              listItemComponents={
                      ([] as any).concat.apply(
                        [] as any[],
                        (votingInfo?.proConArticles?.map((article: ProConArticleExt, index) => ([
                          {
                            labelText: `${index + 1}# article (${article.isVoteOnA ? 'vote on A' : 'vote on B'}) - approved: ${article.isArticleApproved ? 'yes' : 'no'}`,
                            component: (
                              <ToggleList
                                listItemComponents={article.isArticleApproved ? [
                                  {
                                    labelText: 'Content description',
                                    component: <PdfViewer documentUrl={`${IPFS_GATEWAY_URL}/${article.articleIpfsHash}`} />,
                                    css: { marginLeft: '20px' }
                                  },
                                  {
                                    labelText: 'Content check quiz',
                                    component:
                                  <ContentCheckQuizForm
                                    quizIpfsHash={article.articleContentCheckQuizIpfsHash || ''}
                                    accountQuestionIndexes={
                                      article.articleContentCheckQuestionIndexes || []
                                    }
                                    completeVotingQuizFn={
                                      (answers: string[]) => completeArticleQuiz(
                                        article.articleKey,
                                        answers
                                      )
                                    }
                                  />,
                                    css: { marginLeft: '20px' }

                                  }
                                ] : []}
                              />
                            ),
                            icon: <ArticleIcon />
                          },
                          {
                            labelText: `Response on article ${index + 1}# - approved: ${article.isResponseApproved ? 'yes' : 'no'}`,
                            component: (
                              <ToggleList
                                listItemComponents={article.isResponseApproved ? [
                                  {
                                    labelText: 'Content description',
                                    component: <PdfViewer documentUrl={`${IPFS_GATEWAY_URL}/${article.responseStatementIpfsHash}`} />,
                                    css: { marginLeft: '20px' }
                                  },
                                  {
                                    labelText: 'Content check quiz',
                                    component:
                                  <ContentCheckQuizForm
                                    quizIpfsHash={article.responseContentCheckQuizIpfsHash}
                                    accountQuestionIndexes={
                                      article?.articleResponseCheckQuestionIndexes || []
                                    }
                                    completeVotingQuizFn={
                                      (answers: string[]) => completeArticleResponseQuiz(
                                        article.articleKey,
                                        answers
                                      )
                                    }
                                  />,
                                    css: { marginLeft: '20px' }

                                  }
                                ] : []}
                              />
                            ),
                            icon: <ArticleIcon />
                          }
                        ]
                        )) || [])
                      )
                  }
            />

            <Stack direction="row" spacing={2}>
              <Button sx={{ width: '50%' }} onClick={() => vote(true)} disabled={!canVote} variant="contained">YES</Button>
              <Button sx={{ width: '50%' }} onClick={() => vote(false)} disabled={!canVote} variant="contained">NO</Button>
            </Stack>
          </Stack>
          )}
        </Stack>
      </LoadContent>
    </FormContainer>
  );
};

export default VotingForm;
