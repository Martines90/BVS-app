import { Dispatch, SetStateAction } from 'react';
import { ComponentChildren, UserMode, UserRole } from '@global/types/global';

export type UserState = {
  loggedIn: boolean;
  mode: UserMode;
  roles: UserRole[];
};

export interface IUserContext {
  setUserState: Dispatch<SetStateAction<UserState>>;
  userState: UserState;
}

export interface UserContextWrapperProps {
  userState?: UserState;
  children: ComponentChildren;
}
