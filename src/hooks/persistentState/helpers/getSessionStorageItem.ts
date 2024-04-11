import { NO_PERSTISTANT_STATE_PROPS } from '@global/constants/flags';

const getSessionStorageItem = (key: string) => {
  const value = window.sessionStorage.getItem(key);

  if (!value) return null;

  const obj = JSON.parse(value);

  // make sure if an object props has a function value at any level then it will set to undefined
  Object.keys(obj).forEach((objKey) => {
    if (
      typeof obj[objKey] === 'object'
      && obj[objKey] !== null
      && NO_PERSTISTANT_STATE_PROPS.includes(objKey)
    ) {
      obj[objKey] = undefined;
    }
  });

  return obj;
};

export default getSessionStorageItem;
