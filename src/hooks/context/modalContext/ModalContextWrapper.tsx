import React, { useMemo, useState } from 'react';
import ModalContext from './ModalContext';
import Modal from '@components/general/Modal/Modal';
import { ModalContextWrapperProps } from './types';

const ModalContextWrapper: React.FC<ModalContextWrapperProps> = ({
  children
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [content, setContent] = useState<React.ReactNode>(null);

  const showModal = (modalContent: React.ReactNode) => {
    setContent(modalContent);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setContent(null);
  };

  const initModalContext = useMemo(
    () => ({
      showModal,
      hideModal,
      isVisible,
      setIsVisible,
      content,
      setContent
    }),
    [isVisible, content]
  );

  return (
    <ModalContext.Provider value={initModalContext}>
      {children}
      <Modal modalContent={content} />
    </ModalContext.Provider>
  );
};

export default ModalContextWrapper;
