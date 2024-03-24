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
  connected: boolean;
  mode: UserMode;
};
