import UserChooseModeModal from '@components/UserChooseModeModal/UserChooseModeModal';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';
import React from 'react';

const DashboardPage: React.FC = () => {
  const { showModal, isVisible } = useModalContext();

  if (!isVisible) {
    showModal(<UserChooseModeModal />);
  }

  return <div>Welcome on the Dashboard page</div>;
};

export default DashboardPage;
