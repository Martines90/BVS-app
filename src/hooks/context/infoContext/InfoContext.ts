import { createContext, useContext } from 'react';
import { IInfoContext } from './types';

export const initialInfoContextValue: IInfoContext = {
  setAlerts: () => {},
  alerts: {}
};

const InfoContext = createContext<IInfoContext>(initialInfoContextValue);

export const useInfoContext = () => useContext(InfoContext);

export default InfoContext;
