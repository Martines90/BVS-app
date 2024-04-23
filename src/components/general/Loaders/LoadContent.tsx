import { Box, Stack, Typography } from '@mui/material';
import { CircularProgressL } from './components/CircularProgress';

type Props = {
  children: React.ReactNode;
  condition: boolean;
};

const LoadContent = ({ children, condition }: Props) => {
  if (condition) {
    return (
      <Box textAlign="center" alignContent="center">
        <Stack spacing={2}>
          <Typography>Communication with server is in progress...</Typography>
          <Box textAlign="center">
            <CircularProgressL />
          </Box>
        </Stack>
      </Box>
    );
  }

  return children;
};

export default LoadContent;
