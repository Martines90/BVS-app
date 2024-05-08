import { Box } from '@mui/material';

type Props = {
  children: React.ReactNode;
  css?: any;
};

const FormContainer = ({ children, css = {} }: Props) => (
  <Box sx={{
    maxWidth: 500, m: 'auto', p: 2, ...css
  }}
  >{children}
  </Box>
);

export default FormContainer;
