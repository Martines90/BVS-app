import { BVS_Voting } from '@blockchain/contract';
import { ContractRoleskeccak256 } from '@global/types/user';
import { AddressLike, BytesLike, Contract } from 'ethers';

export interface ContractInteractionProps {
  contract: Contract & BVS_Voting | undefined;
  applyForCitizenshipRole(applicantEmailPubKeyHash: BytesLike,
    applicationFee: number): void;
  grantCitizenRole(publicKey: AddressLike, applicationHash: BytesLike): void;
  hasRole(role: ContractRoleskeccak256, walletAddress: AddressLike): Promise<boolean>;
  isAccountAppliedForCitizenship(accountPublicKey: AddressLike): Promise<boolean>;
  isHashMatchWithCitizenshipApplicationHash(
    publicKey: AddressLike, applicationHash: BytesLike): Promise<boolean>;
  isThereOngoingElections(): Promise<boolean>;
  scheduleNextElections(fromDate: number, toDate: number): void;
  getCitizenRoleApplicationFee(): Promise<number>;
  getElectionStartEndIntervalInDays(): Promise<number>;
  getElectionsStartDate(): Promise<number>;
}
