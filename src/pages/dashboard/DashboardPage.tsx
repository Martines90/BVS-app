import UserChooseModeModal from '@components/UserChooseModeModal/UserChooseModeModal';
import { getUserMode } from '@global/selectors/user';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import React from 'react';

const DashboardPage: React.FC = () => {
  const { showModal, isVisible } = useModalContext();
  const { userState } = useUserContext();

  if (isVisible === undefined && !getUserMode(userState)) {
    showModal(<UserChooseModeModal />);
  }

  return <div>Welcome on the Dashboard page</div>;
};

export default DashboardPage;
