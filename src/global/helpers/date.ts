/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

export const formatDateTime = (contractDate: number) => dayjs(contractDate).format('DD/MM/YYYY');

export const formatDateTimeToTime = (contractDate: number) => dayjs(contractDate).format('DD/MM/YYYY HH:mm:ss');

export const getNow = () => Number(Cookies.get('FAKE_NOW') || dayjs().toDate().getTime());
