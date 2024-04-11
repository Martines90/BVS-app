import React from 'react';

import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeToggle } from '@hooks/context/themeContext/ThemeContextWrapper';

const ToggleThemeButton: React.FC = () => {
  const { toggleTheme, mode } = useThemeToggle();

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default ToggleThemeButton;
