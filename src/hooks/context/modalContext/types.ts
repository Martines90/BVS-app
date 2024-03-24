import { ReactNode } from 'react';

export type IModalContext = {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
  content: ReactNode;
  isVisible: boolean;
};

export type ModalContextWrapperProps = {
  children: React.ReactNode;
};
