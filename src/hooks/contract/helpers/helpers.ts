/* eslint-disable import/prefer-default-export */
import { Article_ContractData } from '../types';

export const articleRawDataToArticle = (
  articleKey: string,
  votingRelatedArticle: Article_ContractData
) => (
  {
    articleKey,
    votingKey: votingRelatedArticle[0],
    isArticleApproved: votingRelatedArticle[1],
    isResponseApproved: votingRelatedArticle[2],
    publisher: votingRelatedArticle[3],
    articleIpfsHash: votingRelatedArticle[4],
    isVoteOnA: votingRelatedArticle[5],
    responseStatementIpfsHash: votingRelatedArticle[6],
    articleContentCheckQuizIpfsHash: votingRelatedArticle[7],
    responseContentCheckQuizIpfsHash: votingRelatedArticle[8]
  }
);
