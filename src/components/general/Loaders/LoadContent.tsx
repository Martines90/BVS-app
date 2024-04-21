import { Box } from '@mui/material';
import { CircularProgressL } from './components/CircularProgress';

type Props = {
  children: React.ReactNode;
  condition: boolean;
};

const LoadContent = ({ children, condition }: Props) => {
  if (condition) {
    return (
      <Box textAlign="center">
        <CircularProgressL />
      </Box>
    );
  }

  return children;
};

export default LoadContent;
