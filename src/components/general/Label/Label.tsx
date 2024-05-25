import { Typography } from '@mui/material';

const Label = ({ text, css = {} }: { text: string, css?: any }) => (
  <Typography sx={{
    fontWeight: 'bold',
    lineHeight: '50px',
    display: 'table-cell',
    ...css
  }}
  >
    {text}
  </Typography>
);

export default Label;
