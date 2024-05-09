import { BVS_Voting } from '@blockchain/contract';
import { USER_ROLES } from '@global/types/user';
import {
  AddressLike, BytesLike, Contract
} from 'ethers';

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
};

export interface ContractInteractionProps {
  contract: Contract & BVS_Voting | undefined;
  applyForCitizenshipRole(applicantEmailPubKeyHash: BytesLike,
    applicationFee: number): Promise<void>;
  applyForElectionsAsCandidate(applicationFee: number): Promise<void>,
  closeElections(): Promise<void>,
  grantCitizenRole(publicKey: AddressLike, applicationHash: BytesLike): Promise<void>;
  hasRole(role: USER_ROLES, walletAddress: AddressLike): Promise<boolean>;
  isAccountAlreadyVoted(): Promise<boolean>;
  isAccountAppliedForCitizenship(accountPublicKey: AddressLike): Promise<boolean>;
  isCandidateAlreadyApplied(candidatePublicKey: AddressLike): Promise<boolean>;
  isHashMatchWithCitizenshipApplicationHash(
    publicKey: AddressLike, applicationHash: BytesLike): Promise<boolean>;
  isThereOngoingElections(): Promise<boolean>;
  scheduleNextElections(fromDate: number, toDate: number): Promise<void>;
  scheduleNewVoting(ipfsHash: string, startDate: number, targetBudget: number): Promise<void>;
  setFirstVotingCycleStartDate(date: number): Promise<void>;
  voteOnElectionsCandidate(candidatePublicKey: AddressLike): Promise<void>;
  getAccountVotingScore(votingKey: BytesLike, accountAddress: AddressLike): Promise<number>;
  getAdministratorAtIndex(index: number): Promise<AddressLike>;
  getCitizenRoleApplicationFee(): Promise<number>;
  getCitizenAtIndex(index: number): Promise<AddressLike>;
  getElectionCandidateApplicationFee(): Promise<number>;
  getElectionsCandidatePublicKeyAtIndex(index: number): Promise<AddressLike>;
  getElectionCandidateScore(accountAddress: AddressLike): Promise<number>;
  getElectionStartEndIntervalInDays(): Promise<number>;
  getElectionsStartDate(): Promise<number>;
  getElectionsEndDate(): Promise<number>;
  getFirstVotingCycleStartDate(): Promise<number>;
  getNumberOfAdministrators(): Promise<number>;
  getNumberOfCitizens(): Promise<number>;
  getNumberOfPoliticalActors(): Promise<number>;
  getNumberOfElectionCandidates(): Promise<number>;
  getNumberOfVotings(): Promise<number>;
  getVotingDuration(): Promise<number>;
  getVotingAtKey(votingKey: BytesLike): Promise<Voting>;
  getVotingCycleMinCloseToTheEndTime(): Promise<number>;
  getVotingKeyAtIndex(index: number): Promise<AddressLike>;
  getPoliticalActorAtIndex(index: number): Promise<AddressLike>;
  getPoliticalActorVotingCredits(accountKey: AddressLike): Promise<number>;
  getPoliticalActorVotingCycleVoteStartCount(
    accountKey: AddressLike, voteCycleCount: number): Promise<number>;
  getVotedOnCandidatePublicKey(): Promise<AddressLike>;
  getVotingCycleInterval(): Promise<number>;
}
