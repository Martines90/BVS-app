/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs';

export const formatContractDateTime = (contractDate: number) => dayjs(contractDate).format('DD/MM/YYYY');

export const getNow = () => dayjs().toDate().getTime() / 1000;
