import { Location } from 'react-router-dom';

export const getFullRoute = (location: Location<any>) => `${location.pathname}${location.hash}`.slice(1);
