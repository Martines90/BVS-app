import React from 'react';
import { useModalContext } from '@hooks/context/modalContext/ModalContext';
import { ModalProps } from './types';
import { Box, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
          alignItems: 'center',
          outline: 'none' // Remove default focus outline
        }}
      >
        <IconButton
          aria-label='close'
          onClick={hideModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        {modalContent}
      </Box>
    </Modal>
  );
};

export default ModalComponent;
