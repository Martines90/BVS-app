import { Typography } from '@mui/material';

const YesNoText = ({ text }: { text: 'yes' | 'no' }) => <Typography sx={{ color: (text === 'yes' ? 'green' : 'red') }}>{text}</Typography>;

export default YesNoText;
