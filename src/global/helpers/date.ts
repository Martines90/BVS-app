/* eslint-disable import/prefer-default-export */
import { TimeQuantities } from '@global/constants/general';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

export const formatToDayHourMin = (date?: number) => date
&& `${dayjs(date).day()} days ${dayjs(date).format('HH:mm')}`;

export const formatDateTime = (date?: number) => date && dayjs(date).format('DD/MM/YYYY');

export const formatDateTimeToTime = (date?: number) => date && dayjs(date).format('DD/MM/YYYY HH:mm');

export const getNow = () => Number(Cookies.get('FAKE_NOW') || dayjs().toDate().getTime());

export const toDays = (time: number) => Math.floor(time / (1000 * TimeQuantities.DAY));

export const toHours = (time: number) => Math.floor(time / (1000 * TimeQuantities.HOUR));

export const toMinutes = (time: number) => Math.floor(time / (1000 * 60));

export const toTimeUnits = (time: number | undefined, isStringFormat = false) => {
  if (time === undefined) {
    return '';
  }
  const days = toDays(time);
  const hourMinLeft = time % (1000 * TimeQuantities.DAY);
  const hours = toHours(hourMinLeft);
  const minLeft = hourMinLeft % (1000 * TimeQuantities.HOUR);
  const minutes = toMinutes(minLeft);

  if (!isStringFormat) {
    return {
      days,
      hours,
      minutes
    };
  }
  return `${days} days, ${hours} hours, ${minutes} minutes`;
};
