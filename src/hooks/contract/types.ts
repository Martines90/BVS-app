import { BVS_Voting } from '@blockchain/contract';
import { USER_ROLES } from '@global/types/user';
import { AddressLike, BytesLike, Contract } from 'ethers';

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
  voteOnElectionsCandidate(candidatePublicKey: AddressLike): Promise<void>;
  getCitizenRoleApplicationFee(): Promise<number>;
  getElectionCandidateApplicationFee(): Promise<number>;
  getElectionsCandidatePublicKeyAtIndex(index: number): Promise<AddressLike>;
  getElectionCandidateScore(accountAddress: AddressLike): Promise<number>;
  getElectionStartEndIntervalInDays(): Promise<number>;
  getElectionsStartDate(): Promise<number>;
  getElectionsEndDate(): Promise<number>;
  getNumberOfElectionCandidates(): Promise<number>;
  getVotedOnCandidatePublicKey(): Promise<AddressLike>;
}
