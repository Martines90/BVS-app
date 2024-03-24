import { Dispatch, SetStateAction } from 'react';
import { ComponentChildren } from '@global/types/global';
import { UserState } from '@global/types/user';

export interface IUserContext {
  setUserState: Dispatch<SetStateAction<UserState>>;
  userState: UserState;
}

export interface UserContextWrapperProps {
  userState?: UserState;
  children: ComponentChildren;
}
