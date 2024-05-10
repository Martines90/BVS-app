import { Typography } from '@mui/material';

const SubTitle = ({ text }: { text: string }) => (
  <Typography sx={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>{text}</Typography>
);

export default SubTitle;
