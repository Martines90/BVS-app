import { CircuralProgressL } from '@components/general/Loading/components/CircuralProgress';
import { Box, Stack } from '@mui/material';

export const CommunicationWithContractIsInProgressLoader = () => {
  return (
    <Stack direction={'column'}>
      Communication with contract is in progress...
      <Box textAlign={'center'}>
        <CircuralProgressL />
      </Box>
    </Stack>
  );
};
