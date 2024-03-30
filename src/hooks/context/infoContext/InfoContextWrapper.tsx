import { useMemo, SetStateAction, Dispatch } from 'react';

import InfoContext from './InfoContext';
import { InfoContextWrapperProps } from './types';
import usePersistantState from '@hooks/persistentState/usePersistentState';
import { AlertMessages } from '@global/types/global';

const InfoContextWrapper = ({ children }: InfoContextWrapperProps) => {
  const [alerts, setAlerts] = usePersistantState('infoState', {}) as [
    AlertMessages,
    Dispatch<SetStateAction<AlertMessages>>
  ];

  const initInfoContext = useMemo(
    () => ({
      setAlerts,
      alerts
    }),
    [alerts]
  );

  return (
    <InfoContext.Provider value={initInfoContext}>
      {children}
    </InfoContext.Provider>
  );
};

export default InfoContextWrapper;
