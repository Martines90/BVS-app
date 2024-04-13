import { Dispatch, SetStateAction, useMemo } from 'react';

import { UserState } from '@global/types/user';
import usePersistantState from '@hooks/persistentState/usePersistentState';
import UserContext, { initialUserContextValue } from './UserContext';
import { UserContextWrapperProps } from './types';

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
