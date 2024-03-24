import { ThemeMode } from '@global/types/global';

export interface IThemeContext {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export type ThemeProviderWrapperProps = {
  children: React.ReactNode;
};
