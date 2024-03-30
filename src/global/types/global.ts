export type ThemeMode = 'light' | 'dark';
export type ComponentChildren = React.ReactNode | React.ReactNode[];

export type AlertMessages = {
  [key: string]: {
    severity: 'success' | 'info' | 'warning' | 'error';
    text: string;
  };
};
