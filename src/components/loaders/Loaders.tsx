import { CircuralProgressL } from '@components/general/Loading/components/CircuralProgress';
import { AlignHorizontalCenter } from '@mui/icons-material';
import { Box, Grid, Stack } from '@mui/material';

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
