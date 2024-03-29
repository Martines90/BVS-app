export type ThemeMode = 'light' | 'dark';
export type ComponentChildren = React.ReactNode | React.ReactNode[];

export type AlertMessage = {
  [key: string]: {
    severity: 'success' | 'info' | 'warning' | 'error';
    text: string;
  };
};
