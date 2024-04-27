/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

export const formatDateTime = (date?: number) => date && dayjs(date).format('DD/MM/YYYY');

export const formatDateTimeToTime = (date?: number) => date && dayjs(date).format('DD/MM/YYYY HH:mm');

export const getNow = () => Number(Cookies.get('FAKE_NOW') || dayjs().toDate().getTime());
