/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

export const formatContractDateTime = (contractDate: number) => dayjs(contractDate).format('DD/MM/YYYY');

export const getNow = () => Number(Cookies.get('FAKE_NOW') || dayjs().toDate().getTime());
