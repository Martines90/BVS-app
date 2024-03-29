import UserChooseModeModal from '@components/UserChooseModeModal/UserChooseModeModal';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import React, { useEffect } from 'react';

const DashboardPage: React.FC = () => {
  const { showModal, isVisible } = useModalContext();
  const { userState } = useUserContext();

  const isUserSelectedMode = !!userState.mode;

  useEffect(() => {
    if (!isUserSelectedMode && !isVisible) {
      showModal(<UserChooseModeModal />);
    }
  }, [isVisible, userState]);

  if (!isUserSelectedMode) {
    return null;
  }

  return <div>Welcome on the Dashboard page</div>;
};

export default DashboardPage;
