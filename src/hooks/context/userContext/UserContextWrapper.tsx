import { useMemo, useState, useEffect } from 'react';

import UserContext, {
  initialUserContextValue
} from '@hooks/context/userContext/UserContext';
import { UserContextWrapperProps } from './types';

const UserContextWrapper = ({
  children,
  userState: iUserState = initialUserContextValue.userState
}: UserContextWrapperProps) => {
  const [userState, setUserState] = useState(iUserState);

  const initAdViewContext = useMemo(
    () => ({
      setUserState,
      userState
    }),
    [userState]
  );

  useEffect(() => {
    setUserState(iUserState);
  }, [iUserState]);

  return (
    <UserContext.Provider value={initAdViewContext}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextWrapper;
