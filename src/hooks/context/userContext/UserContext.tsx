import { createContext, useContext } from 'react';
import { IUserContext } from './types';

export const initialUserContextValue: IUserContext = {
  setUserState: () => {},
  userState: {
    connected: false,
    mode: undefined
  }
};

const UserContext = createContext<IUserContext>(initialUserContextValue);

export const useUserContext = () => useContext(UserContext);

export default UserContext;
