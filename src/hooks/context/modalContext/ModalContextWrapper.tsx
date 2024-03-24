import React, { useState } from 'react';
import ModalContext from './ModalContext';
import Modal from '@components/general/Modal/Modal';
import { ModalContextWrapperProps } from './types';

const ModalContextWrapper: React.FC<ModalContextWrapperProps> = ({
  children
}) => {
  const [isVisible, setIsVisible] = useState<boolean | undefined>(undefined);
  const [content, setContent] = useState<React.ReactNode>(null);

  const showModal = (modalContent: React.ReactNode) => {
    setContent(modalContent);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, content, isVisible }}>
      {children}
      {isVisible && <Modal modalContent={content} />}
    </ModalContext.Provider>
  );
};

export default ModalContextWrapper;
