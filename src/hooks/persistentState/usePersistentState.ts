import { NO_PERSTISTANT_STATE_PROPS } from '@global/constants/flags';
import { useEffect, useState } from 'react';

export default function usePersistantState<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [state, setInternalState] = useState<T>(initialValue);

  useEffect(() => {
    const value = window.sessionStorage.getItem(key);

    if (!value) return;

    const obj = JSON.parse(value);

    // make sure if an object props has a function value at any level then it will set to undefined
    Object.keys(obj).forEach((objKey) => {
      if (
        typeof obj[objKey] === 'object' &&
        obj[objKey] !== null &&
        NO_PERSTISTANT_STATE_PROPS.includes(objKey)
      ) {
        obj[objKey] = undefined;
      }
    });

    setInternalState(obj);
  }, [key]);

  const setState = (value: T) => {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    setInternalState(value);
  };

  return [state, setState];
}
