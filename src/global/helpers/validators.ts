/* eslint-disable import/prefer-default-export */
import { AddressLike } from 'ethers';

export const isValidAddress = (address: AddressLike | undefined) => !!address && address !== '0x0000000000000000000000000000000000000000';

type AnyAddressCompatible = AddressLike | string | undefined;

export const compare2Address = (
  address1: AnyAddressCompatible,
  address2: AnyAddressCompatible
) => (address1 as string).toLowerCase() === (address2 as string).toLowerCase();
