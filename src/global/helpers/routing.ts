/* eslint-disable import/prefer-default-export */
import { Location } from 'react-router-dom';

export const getFullRoute = (location: Location<any>) => `${location.pathname}${location.hash}`.slice(1);

export const getVotingKeyFromHash = (hash: string) => (hash.includes('?voting_key=') ? hash.split('?voting_key=')[1] : '');
