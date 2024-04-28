/* eslint-disable import/prefer-default-export */
const hourInSec = 60 * 60;

export enum TimeQuantities {
  YEAR = hourInSec * 24 * 356,
  MONTH = hourInSec * 24 * 30,
  WEEK = hourInSec * 24 * 7,
  DAY = hourInSec * 24,
  HOUR = hourInSec
}

export const TABLE_DISPLAY_MAX_ROWS = 10;
