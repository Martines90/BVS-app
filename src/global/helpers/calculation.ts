/* eslint-disable import/prefer-default-export */
export const to2DecimalFixed = (amount: number) => (
  parseFloat((Math.round(amount * 10000) / 100).toFixed(2)));
