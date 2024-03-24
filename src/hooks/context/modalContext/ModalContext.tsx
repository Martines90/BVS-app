import React, { createContext, useContext, ReactNode } from 'react';

type ModalContextType = {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
  content: ReactNode;
  isVisible: boolean;
};

const initialContext: ModalContextType = {
  showModal: () => {},
  hideModal: () => {},
  content: null,
  isVisible: false
};

const ModalContext = createContext<ModalContextType>(initialContext);

export const useModalContext = () => useContext(ModalContext);

export default ModalContext;
