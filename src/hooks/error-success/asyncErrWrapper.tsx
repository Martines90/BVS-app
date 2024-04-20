import { showErrorToast } from '@components/toasts/Toasts';

const asyncErrWrapper = <A extends any[], R>
  (fn: (...a: A) => Promise<R>) => async (...a: A): Promise<R | undefined> => {
    try {
      return await fn(...a);
    } catch (err: any) {
      showErrorToast(`Err: ${err}`);
      throw Error(err);
    }
  };

export default asyncErrWrapper;
