import { BVS_Voting } from '@assets/contract';
import { Bytes } from '@metamask/utils';
import { AddressLike } from 'ethers';

export enum USER_ROLES {
  CITIZEN = 'citizen',
  POLITICAL_ACTOR = 'political_actor',
  ADMINISTRATOR = 'administrator'
}

export enum ContractRoleskeccak256 {
  ADMINISTRATOR = '0xb346b2ddc13f08bd9685b83a95304a79a2caac0aa7aa64129e1ae9f4361b4661',
  POLITICAL_ACTOR = '0x9f70d138cbbd87297896478196b4493d9dceaca01f5883ecbd7bee66d300348d',
  CITIZEN = '0x313691be6e710b5e9c97c695d02c9e24926f986402f826152f3b2970694f72c9'
}

export enum USER_MODES {
  GUEST = 'guest',
  CITIZEN = 'citizen',
  POLITICAL_ACTOR = 'political_actor',
  ADMINISTRATOR = 'administrator'
}

export type UserMode = USER_MODES | undefined;

export type UserRole = USER_ROLES;

export type UserState = {
  walletAddress?: AddressLike;
  contract?: BVS_Voting;
  chainId?: Bytes;
  mode?: UserMode;
};
