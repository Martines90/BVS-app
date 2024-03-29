import { useMemo, useState, useEffect, SetStateAction, Dispatch } from 'react';

import UserContext, {
  initialUserContextValue
} from '@hooks/context/userContext/UserContext';
import { IUserContext, UserContextWrapperProps } from './types';
import usePersistantState from '@hooks/persistentState/usePersistentState';
import { UserState } from '@global/types/user';

const UserContextWrapper = ({
  children,
  userState: iUserState = initialUserContextValue.userState
}: UserContextWrapperProps) => {
  const [userState, setUserState] = usePersistantState(
    'userState',
    iUserState
  ) as [UserState, Dispatch<SetStateAction<UserState>>];

  const initUserContext = useMemo(
    () => ({
      setUserState,
      userState
    }),
    [userState]
  );

  return (
    <UserContext.Provider value={initUserContext}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextWrapper;
