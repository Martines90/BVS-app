import { BVS_Voting } from '@assets/contract';

export enum USER_ROLES {
  CITIZEN = 'citizen',
  POLITICAL_ACTOR = 'political_actor',
  ADMINISTRATOR = 'administrator'
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
  metaAccount: any;
  contract?: BVS_Voting;
  mode: UserMode;
};
