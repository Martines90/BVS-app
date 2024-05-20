import { Vote } from '@hooks/contract/types';

export type VotingInfo = {
  key?: string;
  startDate?: string;
  contentIpfsHash?: string;
  contentCheckQuizIpfsHash?: string;
  approved?: boolean;
  relatedVotingScore?: number;
  active?: boolean;
  numberOfVotes?: number;
  voteOnAScore?: number;
  voteOnBScore?: number;
  vote?: Vote;
};
