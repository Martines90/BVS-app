import { AlertMessages, ComponentChildren } from '@global/types/global';
import { Dispatch, SetStateAction } from 'react';

export interface IInfoContext {
  setAlerts: Dispatch<SetStateAction<AlertMessages>>;
  alerts: AlertMessages;
}

export interface InfoContextWrapperProps {
  children: ComponentChildren;
}
