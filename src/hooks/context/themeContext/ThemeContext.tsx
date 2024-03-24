import { createContext } from 'react';
import { IThemeContext } from './types';
import { THEME_MODES } from '@global/constants/page';

const initThemeContext: IThemeContext = {
  mode: THEME_MODES.LIGHT,
  toggleTheme: () => {}
};

export const ThemeContext = createContext<IThemeContext>(initThemeContext);
