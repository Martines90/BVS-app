import { showErrorToast } from '@components/toasts/Toasts';

const asyncErrWrapper = <A extends any[], R>
  (fn: (...a: A) => Promise<R>) => async (...a: A): Promise<R | undefined> => {
    try {
      document.body.style.cursor = 'wait';
      return await fn(...a);
    } catch (err: any) {
      showErrorToast(`Err: ${err}`);
      throw Error(err);
    } finally {
      document.body.style.cursor = 'auto';
    }
  };

export default asyncErrWrapper;
