/* eslint-disable import/prefer-default-export */
export const DEFAULT_API_PORT = 3333;

export const DEFAULT_PORT = 8080;

const hourInSec = 60 * 60;

export enum TimeQuantities {
  YEAR = hourInSec * 24 * 356,
  MONTH = hourInSec * 24 * 30,
  WEEK = hourInSec * 24 * 7,
  DAY = hourInSec * 24,
  HOUR = hourInSec
}

export const TABLE_DISPLAY_MAX_ROWS = 10;

export const IPFS_GATEWAY_URL = 'https://quicknode.quicknode-ipfs.com/ipfs';
