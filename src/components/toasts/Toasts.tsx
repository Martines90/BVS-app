/* eslint-disable import/prefer-default-export */
import { TOASTS } from '@global/constants/page';
import { Bounce, ToastOptions, toast } from 'react-toastify';

const defaultToastOptions: ToastOptions = {
  position: TOASTS.defaultPosition as any, // Toastify has a type bug
  autoClose: TOASTS.openTime,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  transition: Bounce
};

export const showErrorToast = (errorMessage: string) => toast.error(errorMessage, {
  ...defaultToastOptions
});

export const showSuccessToast = (errorMessage: string) => toast.success(errorMessage, {
  ...defaultToastOptions
});
