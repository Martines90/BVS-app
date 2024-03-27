import BVS_VotingJSON from '@assets/contract/BVS_Voting.json';
import { BVS_Voting } from '@assets/contract';
import { ethers } from 'ethers';

const connectToContract = async (ethereum: any): Promise<BVS_Voting> => {
  const provider = new ethers.BrowserProvider(ethereum);

  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    '0x25C47e31bf6C6C32c18eE8A3a84e8719D95cdbd4',
    BVS_VotingJSON.abi,
    signer
  ) as unknown as BVS_Voting;

  return contract;
};

export default connectToContract;
