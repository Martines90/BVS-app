/* eslint-disable import/prefer-default-export */
import { CircularProgressL } from '@components/general/Loaders/components/CircularProgress';
import { Box, Stack } from '@mui/material';

export const CommunicationWithContractIsInProgressLoader = () => (
  <Stack direction="column">
    Communication with contract is in progress...
    <Box textAlign="center">
      <CircularProgressL />
    </Box>
  </Stack>
);
