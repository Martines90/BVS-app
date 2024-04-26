import {
  Box, Stack, TableCell, TableRow, Typography
} from '@mui/material';
import { CircularProgressL } from './components/CircularProgress';

type Props = {
  children: React.ReactNode;
  condition: boolean;
  colSpan: number;
};

const LoadTableContent = ({ children, condition, colSpan }: Props) => {
  if (condition) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan}>
          <Box textAlign="center" alignContent="center">
            <Stack spacing={2}>
              <Typography>Communication with server is in progress...</Typography>
              <Box textAlign="center">
                <CircularProgressL />
              </Box>
            </Stack>
          </Box>
        </TableCell>
      </TableRow>
    );
  }

  return children;
};

export default LoadTableContent;
