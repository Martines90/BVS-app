import { THEME_MODES } from '@global/constants/page';
import { createContext } from 'react';
import { IThemeContext } from './types';

const initThemeContext: IThemeContext = {
  mode: THEME_MODES.LIGHT,
  toggleTheme: () => {}
};

const ThemeContext = createContext<IThemeContext>(initThemeContext);

export default ThemeContext;
