import getSessionStorageItem from '@hooks/persistentState/helpers/getSessionStorageItem';
import { useState } from 'react';

export default function usePersistantState<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [state, setInternalState] = useState<T>(
    getSessionStorageItem(key) || initialValue
  );

  const setState = (value: T) => {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    setInternalState(value);
  };

  return [state, setState];
}
