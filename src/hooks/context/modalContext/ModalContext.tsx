import React, { createContext, useContext } from 'react';
import { IModalContext } from './types';

const initialContext: IModalContext = {
  showModal: () => {},
  hideModal: () => {},
  setIsVisible: () => {},
  setContent: () => {},
  content: null,
  isVisible: false
};

const ModalContext = createContext<IModalContext>(initialContext);

export const useModalContext = () => useContext(ModalContext);

export default ModalContext;
