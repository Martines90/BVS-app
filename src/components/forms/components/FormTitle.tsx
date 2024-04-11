import { Typography } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

const FormTitle = ({ children }: Props) => (
  <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
    {children}
  </Typography>
);

export default FormTitle;
