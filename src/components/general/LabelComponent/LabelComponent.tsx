import { Stack, Typography } from '@mui/material';
import React from 'react';

type Props = {
  label: React.ReactNode,
  component: React.ReactNode
};

export const LabelComponent = ({ label, component }: Props) => (
  <Stack direction="row" spacing={2}>
    <Typography sx={{ fontWeight: 'bold' }}>
      {label}
    </Typography>
    {component}
  </Stack>
);

export default LabelComponent;
