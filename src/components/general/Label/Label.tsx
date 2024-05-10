import { Typography } from '@mui/material';

const Label = ({ text }: { text: string }) => (
  <Typography sx={{
    fontWeight: 'bold',
    lineHeight: '50px',
    display: 'table-cell'
  }}
  >
    {text}
  </Typography>
);

export default Label;
