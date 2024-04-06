import { Box } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

const FormContainer = ({ children }: Props) => (
  <Box sx={{ maxWidth: 500, m: 'auto', p: 2 }}>{children}</Box>
);

export default FormContainer;
