import React from 'react';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';
import { ModalProps } from './types';
import { Box, Modal } from '@mui/material';

const ModalComponent: React.FC<ModalProps> = ({ modalContent }) => {
  const { hideModal } = useModalContext();

  return (
    <Modal open={Boolean(modalContent)} onClose={hideModal}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 'auto' }, // Full width on extra small devices (phones)
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {modalContent}
      </Box>
    </Modal>
  );
};

export default ModalComponent;
