import * as React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => (
  <Box component="footer" sx={{ mt: 'auto', p: 2, backgroundColor: 'primary.main' }}>
    <Typography variant="body1" color="white">
      © 2024 BVS App
    </Typography>
  </Box>
);

export default Footer;
