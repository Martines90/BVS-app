import { UserMode, UserState } from '@global/types/user';

export const getUserMode = (userState: UserState): UserMode => {
  return userState.mode;
};
