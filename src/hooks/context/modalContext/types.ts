import { Dispatch, ReactNode, SetStateAction } from 'react';

export type IModalContext = {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  content: ReactNode;
  setContent: Dispatch<SetStateAction<ReactNode>>;
};

export type ModalContextWrapperProps = {
  children: React.ReactNode;
};
