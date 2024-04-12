import { ContractRoleskeccak256 } from '@global/types/user';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { AddressLike, BytesLike } from 'ethers';
import { ContractInteractionProps } from './types';

const useContract = (): ContractInteractionProps => {
  const { userState } = useUserContext();

  const { contract } = userState;

  const applyForCitizenshipRole = async (
    applicantEmailPubKeyHash: BytesLike,
    applicationFee: number
  ) => {
    try {
      await userState.contract?.applyForCitizenshipRole(
        applicantEmailPubKeyHash,
        {
          value: applicationFee,
          from: userState.walletAddress
        }
      );
    } catch (err) {
      throw Error(`Err: ${err}`);
    }
  };

  const grantCitizenRole = async (
    publicKey: AddressLike,
    applicationHash: BytesLike
  ) => {
    try {
      await contract?.grantCitizenRole(publicKey, applicationHash, false);
    } catch (err) {
      throw Error(`Err: ${err}`);
    }
  };

  const hasRole = async (
    role: ContractRoleskeccak256,
    walletAddress: AddressLike
  ) => {
    try {
      return Boolean(await contract?.hasRole(role, walletAddress));
    } catch (err) {
      throw Error(`Err: ${err}`);
    }
  };

  const isAccountAppliedForCitizenship = async (
    accountPublicKey: AddressLike
  ) => {
    try {
      return ((
        await contract?.citizenshipApplications(accountPublicKey)) || 0) !== 0;
    } catch (err) {
      throw Error(`Err: ${err}`);
    }
  };

  const isHashMatchWithCitizenshipApplicationHash = async (
    publicKey: AddressLike,
    applicationHash: BytesLike
  ) => {
    try {
      return (
        (await contract?.citizenshipApplications(publicKey)) || 0) === applicationHash;
    } catch (err) {
      throw Error(`Err: ${err}`);
    }
  };

  const isThereOngoingElections = async () => {
    try {
      return (await contract?.electionsStartDate()) !== BigInt(0);
    } catch (err) {
      throw Error(`Err: ${err}`);
    }
  };

  const scheduleNextElections = async (fromDate: number, toDate: number) => {
    try {
      await contract?.scheduleNextElections(BigInt(fromDate), BigInt(toDate));
    } catch (err) {
      throw Error(`Err: ${err}`);
    }
  };

  const getCitizenRoleApplicationFee = async () => {
    try {
      return Number(await contract?.citizenRoleApplicationFee() || 0);
    } catch (err) {
      throw Error(`Err: ${err}`);
    }
  };

  const getElectionStartEndIntervalInDays = async () => {
    try {
      return Number(
        (((await contract?.ELECTION_START_END_INTERVAL()) || 0) as bigint)
        / BigInt(60 * 60 * 24)
      );
    } catch (err) {
      throw Error(`Err: ${err}`);
    }
  };

  const getElectionsStartDate = async () => {
    try {
      return Number(await contract?.electionsStartDate());
    } catch (err) {
      throw Error(`Err: ${err}`);
    }
  };

  return {
    contract,
    getCitizenRoleApplicationFee,
    getElectionStartEndIntervalInDays,
    getElectionsStartDate,
    applyForCitizenshipRole,
    grantCitizenRole,
    hasRole,
    isAccountAppliedForCitizenship,
    isHashMatchWithCitizenshipApplicationHash,
    isThereOngoingElections,
    scheduleNextElections
  };
};

export default useContract;
