import { ContractRoleskeccak256 } from '@global/types/user';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { AddressLike, BytesLike } from 'ethers';

const useContract = () => {
  const { userState } = useUserContext();

  const contract = userState.contract;

  const hasRole = async (
    role: ContractRoleskeccak256,
    walletAddress: AddressLike
  ) => {
    const hasRole = await contract?.hasRole(role, walletAddress);
    return hasRole;
  };

  const getCitizenRoleApplicationFee = async () => {
    return Number((await contract?.citizenRoleApplicationFee()) || 0);
  };

  const getElectionStartEndIntervalInDays = async () => {
    const electionStartEndInterval = Number(
      (((await contract?.ELECTION_START_END_INTERVAL()) || 0) as bigint) /
        BigInt(60 * 60 * 24)
    );
    return electionStartEndInterval;
  };

  const getElectionsStartDate = async () => {
    return await contract?.electionsStartDate();
  };

  const applyForCitizenshipRole = async (
    applicantEmailPubKeyHash: BytesLike,
    applicationFee: number
  ) => {
    await userState.contract?.applyForCitizenshipRole(
      applicantEmailPubKeyHash,
      {
        value: applicationFee,
        from: userState.walletAddress
      }
    );
  };

  const isAccountAppliedForCitizenship = async (
    accountPublicKey: AddressLike
  ) => {
    const appliedForCitizenship =
      ((await contract?.citizenshipApplications(accountPublicKey)) || 0) != 0;
    return appliedForCitizenship;
  };

  const isHashMatchWithCitizenshipApplicationHash = async (
    publicKey: AddressLike,
    applicationHash: BytesLike
  ) => {
    const hashMatchesWithApplicationHash =
      ((await contract?.citizenshipApplications(publicKey)) || 0) ==
      applicationHash;

    return hashMatchesWithApplicationHash;
  };

  const isThereOngoingElections = async () => {
    return (await contract?.electionsStartDate()) !== BigInt(0);
  };

  const grantCitizenRole = async (
    publicKey: AddressLike,
    applicationHash: BytesLike
  ) => {
    await contract?.grantCitizenRole(publicKey, applicationHash, false);
  };

  return {
    contract,
    hasRole,
    getCitizenRoleApplicationFee,
    getElectionStartEndIntervalInDays,
    getElectionsStartDate,
    applyForCitizenshipRole,
    grantCitizenRole,
    isAccountAppliedForCitizenship,
    isHashMatchWithCitizenshipApplicationHash,
    isThereOngoingElections
  };
};

export default useContract;
