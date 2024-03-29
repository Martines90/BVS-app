import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ThemeContext } from './ThemeContext';
import { DEFAULT_THEME_MODE, THEME_MODES } from '@global/constants/page';
import { ThemeProviderWrapperProps } from './types';
import { ThemeMode } from '@global/types/global';

export const useThemeToggle = () => useContext(ThemeContext);

const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({
  children
}) => {
  const [mode, setMode] = useState<ThemeMode>(
    (localStorage.getItem('themeMode') as ThemeMode) || DEFAULT_THEME_MODE
  );

  const colorMode = useMemo(
    () => ({
      // Toggle between 'dark' and 'light'
      toggleTheme: () => {
        const newMode =
          mode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
        setMode((prevMode) =>
          prevMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT
        );
        localStorage.setItem('themeMode', newMode);
      },
      mode
    }),
    [mode]
  );

  // Update the theme only if the mode changes
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode
        }
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;