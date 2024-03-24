import React, { createContext, useContext } from 'react';
import { IModalContext } from './types';

const initialContext: IModalContext = {
  showModal: () => {},
  hideModal: () => {},
  content: null,
  isVisible: false
};

const ModalContext = createContext<IModalContext>(initialContext);

export const useModalContext = () => useContext(ModalContext);

export default ModalContext;
