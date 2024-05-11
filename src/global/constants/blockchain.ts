export type BVS_Contract = {
  chainId: string;
  address: string;
};

// hardhat local network
export const BVS_CONTRACT = {
  chainId: 1337, // 31337,
  chainIdHex: 0x7a69
};

export const BVS_HARDCODED_SETTINGS = {
  electionsCanCloseAfterDays: 7, // FIX ME: place it into the contract as a constant
  newVotingCanStartAfterDays: 10,
  newVotingCantStartAfterDays: 30
};

export const GWEI_TO_WEI = 1000000000;
