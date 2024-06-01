import { BVS_Voting } from '@blockchain/contract';
import { USER_ROLES } from '@global/types/user';
import {
  AddressLike, BytesLike, Contract
} from 'ethers';

export type Article_ContractData = [
  string,
  boolean,
  boolean,
  string,
  string,
  boolean,
  string,
  string,
  string
];

export type Voting = {
  approved: boolean;
  cancelled: boolean;
  key: BytesLike;
  budget: number;
  voteCount: number;
  creator: AddressLike;
  contentIpfsHash: string;
  startDate: number;
  voteOnAScore: number;
  voteOnBScore: number;
  votingContentCheckQuizIpfsHash: string;
  actualNumberOfCitizens: number;
};

export type Vote = {
  voted?: boolean;
  isContentQuizCompleted?: boolean;
};

export type ProConArticle = {
  articleKey: BytesLike;
  votingKey: BytesLike;
  isArticleApproved: boolean;
  isResponseApproved: boolean;
  publisher: AddressLike;
  articleIpfsHash: string;
  isVoteOnA: boolean;
  responseStatementIpfsHash: string;
  articleContentCheckQuizIpfsHash: string;
  responseContentCheckQuizIpfsHash: string;
};

export interface ContractInteractionProps {
  contract: Contract & BVS_Voting | undefined;
  addAnswersToVotingContent(votingKey: BytesLike, answers: BytesLike[]): Promise<void>;
  approveVoting(votingKey: BytesLike): Promise<void>;
  assignArticleToVoting(
    votingKey: BytesLike, quizIpfsHash: string, isVoteOnA: boolean): Promise<void>;
  addAnswersToArticleContent(
    votingKey: BytesLike, articleKey: BytesLike, answers: BytesLike[]): Promise<void>;
  addAnswersToResponseContent(
    votingKey: BytesLike, articleKey: BytesLike, answers: BytesLike[]): Promise<void>;
  assignQuizIpfsHashToVoting(votingKey: BytesLike, quizIpfsHash: string): Promise<void>;
  assignQuizIpfsHashToArticle(
    votingKey: BytesLike, articleKey: BytesLike, quizIpfsHash: string): Promise<void>;
  assignQuizIpfsHashToResponse(
    votingKey: BytesLike, articleKey: BytesLike, quizIpfsHash: string): Promise<void>;
  assignResponseIpfsHashToArticle(
    votingKey: BytesLike, articleKey: BytesLike, responseIpfsHash: string): Promise<void>;
  applyForCitizenshipRole(applicantEmailPubKeyHash: BytesLike,
    applicationFee: bigint): Promise<void>;
  applyForElectionsAsCandidate(applicationFee: number): Promise<void>,
  closeElections(): Promise<void>,
  completeArticleContentCheckQuiz(
    votingKey: BytesLike, articleKey: BytesLike, answers: string[]): Promise<void>,
  completeArticleResponseContentCheckQuiz(
    votingKey: BytesLike, articleKey: BytesLike, answers: string[]): Promise<void>,
  completeVotingContentCheckQuiz(votingKey: BytesLike, answers: string[]): Promise<void>,
  grantCitizenRole(publicKey: AddressLike, applicationHash: BytesLike): Promise<void>;
  hasRole(role: USER_ROLES, walletAddress: AddressLike): Promise<boolean>;
  isAccountAlreadyVoted(): Promise<boolean>;
  isAccountAppliedForCitizenship(accountPublicKey: AddressLike): Promise<boolean>;
  isCandidateAlreadyApplied(candidatePublicKey: AddressLike): Promise<boolean>;
  isHashMatchWithCitizenshipApplicationHash(
    publicKey: AddressLike, applicationHash: BytesLike): Promise<boolean>;
  isThereOngoingElections(): Promise<boolean>;
  isVotingWon(votingKey: BytesLike, voteOnA: boolean): Promise<boolean>;
  scheduleNextElections(fromDate: number, toDate: number): Promise<void>;
  scheduleNewVoting(ipfsHash: string, startDate: number, targetBudget: number): Promise<void>;
  setFirstVotingCycleStartDate(date: number): Promise<void>;
  voteOnElectionsCandidate(candidatePublicKey: AddressLike): Promise<void>;
  voteOnVoting(votingKey: BytesLike, voteOnA: boolean): Promise<void>;
  getAccountVotingRelatedQuestionIndexes(
    votingKey: BytesLike,
    accountAddress: AddressLike
  ): Promise<number[]>;
  getAccountArticleRelatedQuestionIndexes(
    votingKey: BytesLike,
    articleKey: BytesLike,
    accountAddress: AddressLike
  ): Promise<number[]>;
  getAccountArticleResponseRelatedQuestionIndexes(
    votingKey: BytesLike,
    articleKey: BytesLike,
    accountAddress: AddressLike
  ): Promise<number[]>;
  getAccountVote(votingKey: BytesLike, accountAddress: AddressLike): Promise<Vote>;
  getAccountVotingScore(votingKey: BytesLike, accountAddress: AddressLike): Promise<number>;
  getAdministratorAtIndex(index: number): Promise<AddressLike>;
  getApproveVotingMinTimeAfterLimit(): Promise<number>;
  getArticleAtKey(votingKey: BytesLike, articleKey: BytesLike): Promise<ProConArticle | undefined>;
  getArticleContentReadCheckAnswersLength(articleKey: BytesLike): Promise<number>;
  getArticleResponseContentReadCheckAnswersLength(articleKey: BytesLike): Promise<number>;
  getCitizenRoleApplicationFee(): Promise<bigint>;
  getCitizenAtIndex(index: number): Promise<AddressLike>;
  getElectionCandidateApplicationFee(): Promise<bigint>;
  getElectionsCandidatePublicKeyAtIndex(index: number): Promise<AddressLike>;
  getElectionCandidateScore(accountAddress: AddressLike): Promise<number>;
  getElectionStartEndIntervalInDays(): Promise<number>;
  getElectionsStartDate(): Promise<number>;
  getElectionsEndDate(): Promise<number>;
  getFirstVotingCycleStartDate(): Promise<number>;
  getMinTotalQuizCheckAnswers(): Promise<number>;
  getMinPercentageOfVotes(): Promise<number>;
  getNumberOfAdministrators(): Promise<number>;
  getNumberOfCitizens(): Promise<number>;
  getNumberOfPoliticalActors(): Promise<number>;
  getNumberOfElectionCandidates(): Promise<number>;
  getNumberOfVotings(): Promise<number>;
  getVotingContentCheckAnswerAtIndex(votingKey: BytesLike, index: number): Promise<string>;
  getVotingContentReadCheckAnswersLength(votingKey: BytesLike): Promise<number>;
  getArticleContentReadCheckAnswersLength(articleKey: BytesLike): Promise<number>;
  getArticleResponseContentReadCheckAnswersLength(responseKey: BytesLike): Promise<number>;
  getVotingDuration(): Promise<number>;
  getVotingAtKey(votingKey: BytesLike): Promise<Voting>;
  getVotingCycleMinCloseToTheEndTime(): Promise<number>;
  getVotingKeyAtIndex(index: number): Promise<AddressLike>;
  getPoliticalActorAtIndex(index: number): Promise<AddressLike>;
  getPoliticalActorPublishArticleToVotingsCount(
    accountKey: AddressLike, votingKey: BytesLike): Promise<number>;
  getPoliticalActorVotingCredits(accountKey: AddressLike): Promise<number>;
  getPoliticalActorVotingCycleVoteStartCount(
    accountKey: AddressLike, voteCycleCount: number): Promise<number>;
  getVotingAssignedArticlesPublished(
    votingKey: BytesLike, account?: AddressLike
  ): Promise<ProConArticle[]>;
  getVotedOnCandidatePublicKey(): Promise<AddressLike>;
  getVotingCycleInterval(): Promise<number>;
}
