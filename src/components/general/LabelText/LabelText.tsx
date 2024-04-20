import { Stack, Typography } from '@mui/material';
import React from 'react';

type Props = {
  label: React.ReactNode,
  text: React.ReactNode
};

export const LabelText = ({ label, text }: Props) => (
  <Stack direction="row" spacing={2}>
    <Typography sx={{ fontWeight: 'bold' }}>
      {label}
    </Typography>
    <Typography>
      {text}
    </Typography>
  </Stack>
);

export default LabelText;
