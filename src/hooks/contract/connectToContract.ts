import BVS_VotingJSON from 'blockchian/contract/BVS_Voting.json';
import { BVS_Voting } from 'blockchian/contract';
import { ethers, Contract } from 'ethers';

import { BVS_CONTRACT } from '@global/constants/blockchain';

const connectToContract = async (
  ethereum: any
): Promise<Contract & BVS_Voting> => {
  const provider = new ethers.BrowserProvider(ethereum);

  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    BVS_CONTRACT.address,
    BVS_VotingJSON.abi,
    signer
  ) as Contract & BVS_Voting;

  return contract;
};

export default connectToContract;
