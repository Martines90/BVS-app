/* eslint-disable import/prefer-default-export */
export const asyncFnWrapper = (_function: any) => async (...args: any[]) => {
  try {
    return _function.apply(this, args);
  } catch (err) {
    throw new Error(`Err: ${err}`);
  }
};
