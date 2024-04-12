/* eslint-disable import/prefer-default-export */
import { CircuralProgressL } from '@components/general/Loading/components/CircuralProgress';
import { Box, Stack } from '@mui/material';

export const CommunicationWithContractIsInProgressLoader = () => (
  <Stack direction="column">
    Communication with contract is in progress...
    <Box textAlign="center">
      <CircuralProgressL />
    </Box>
  </Stack>
);
