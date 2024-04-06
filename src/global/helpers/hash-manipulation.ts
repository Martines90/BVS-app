import { BytesLike } from 'ethers';
import { keccak256 } from 'js-sha3';
const bytes32 = require('bytes32');

export const getBytes32keccak256Hash = (input: string): BytesLike =>
  bytes32({ input: keccak256(input).slice(0, 31) });
