import { ONE_GWEI } from '@global/constants/general';

/* eslint-disable import/prefer-default-export */
export const nthFormat = (n: number) => {
  let ord = 'th';

  if (n % 10 === 1 && n % 100 !== 11) {
    ord = 'st';
  } else if (n % 10 === 2 && n % 100 !== 12) {
    ord = 'nd';
  } else if (n % 10 === 3 && n % 100 !== 13) {
    ord = 'rd';
  }

  return `${n}${ord}`;
};

export const weiToGwei = (amount: bigint | number) => BigInt(amount) / BigInt(ONE_GWEI);

export const gweiToWei = (amount: bigint | number) => BigInt(amount) * BigInt(ONE_GWEI);

export const weiToGweiDecimal = (amount: bigint | number) => Number(
  (BigInt(amount) * BigInt(1000000)) / BigInt(ONE_GWEI)
) / 1000000;

export const displayGweiOrGweiDecimal = (amount: bigint) => (
  amount < BigInt(10 * ONE_GWEI)
    ? weiToGweiDecimal(amount)
    : weiToGwei(amount)
);
