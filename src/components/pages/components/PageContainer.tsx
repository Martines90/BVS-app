import { Box } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

const PageContainer = ({ children }: Props) => (
  <Box sx={{ maxWidth: 1200, m: 'auto', p: 2 }}>{children}</Box>
);

export default PageContainer;
