/* eslint-disable import/prefer-default-export */
const hourInMilSec = 60 * 60;

export enum TimeQuantities {
  YEAR = hourInMilSec * 24 * 356,
  MONTH = hourInMilSec * 24 * 30,
  WEEK = hourInMilSec * 24 * 7,
  DAY = hourInMilSec * 24,
  HOUR = hourInMilSec
}
