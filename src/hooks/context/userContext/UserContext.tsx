import { createContext, useContext } from 'react';
import { IUserContext } from './types';
import { USER_MODES } from '@global/types/global';

export const initialUserContextValue: IUserContext = {
  setUserState: () => {},
  userState: {
    loggedIn: false,
    mode: USER_MODES.GUEST,
    roles: []
  }
};

const UserContext = createContext<IUserContext>(initialUserContextValue);

export const useUserContext = () => useContext(UserContext);

export default UserContext;
