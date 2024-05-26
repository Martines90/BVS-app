import { ProConArticle, Vote } from '@hooks/contract/types';

export type ProConArticleExt = ProConArticle & {
  articleContentCheckQuestionIndexes?: number[],
  articleResponseCheckQuestionIndexes?: number[]
};

export type VotingInfo = {
  key?: string;
  startDate?: string;
  contentIpfsHash?: string;
  contentCheckQuizIpfsHash?: string;
  approved?: boolean;
  relatedVotingScore?: number;
  active?: boolean;
  proConArticles?: ProConArticleExt[];
  numberOfVotes?: number;
  voteOnAScore?: number;
  voteOnBScore?: number;
  vote?: Vote;
};
