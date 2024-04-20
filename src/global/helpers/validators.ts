/* eslint-disable import/prefer-default-export */
import { AddressLike } from 'ethers';

export const isValidAddress = (address: AddressLike | undefined) => !!address && address !== '0x0000000000000000000000000000000000000000';
