import { BVS_Voting } from '@blockchain/contract';
import BVS_VotingJSON from '@blockchain/contract/BVS_Voting.json';
import { Contract, ethers } from 'ethers';

const connectToContract = async (
  ethereum: any
): Promise<Contract & BVS_Voting> => {
  const provider = new ethers.BrowserProvider(ethereum);

  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    process.env.CONTRACT_PUBLIC_KEY || process.env.DEV_CONTRACT_PUBLIC_KEY || '',
    BVS_VotingJSON.abi,
    signer
  ) as Contract & BVS_Voting;

  return contract;
};

export default connectToContract;
