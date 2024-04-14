import { TimeQuantities } from '@global/constants/general';
import { ContractRoleskeccak256, USER_ROLES } from '@global/types/user';
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
    await userState.contract?.applyForCitizenshipRole(
      applicantEmailPubKeyHash,
      {
        value: applicationFee,
        from: userState.walletAddress
      }
    );
  };

  const grantCitizenRole = async (
    publicKey: AddressLike,
    applicationHash: BytesLike
  ) => {
    await contract?.grantCitizenRole(publicKey, applicationHash, false);
  };

  const hasRole = async (
    role: USER_ROLES,
    walletAddress: AddressLike
  ) => Boolean(await contract?.hasRole(ContractRoleskeccak256[role], walletAddress));

  const isAccountAppliedForCitizenship = async (
    accountPublicKey: AddressLike
  ) => {
    const appliedForCitizenship = ((
      Number(await contract?.citizenshipApplications(accountPublicKey)) || 0)) !== 0;

    return appliedForCitizenship;
  };

  const isHashMatchWithCitizenshipApplicationHash = async (
    publicKey: AddressLike,
    applicationHash: BytesLike
  ) => {
    const hashMatchesWithApplicationHash = (
      (await contract?.citizenshipApplications(publicKey)) || '0x0') as BytesLike === applicationHash;

    return hashMatchesWithApplicationHash;
  };

  const isThereOngoingElections = async () => (await contract?.electionsStartDate()) !== BigInt(0);

  const scheduleNextElections = async (fromDate: number, toDate: number) => {
    await contract?.scheduleNextElections(BigInt(fromDate), BigInt(toDate));
  };

  // ********* GETTERS ***********

  const getCitizenRoleApplicationFee = async () => Number(
    (await contract?.citizenRoleApplicationFee()) || 0
  );

  const getElectionStartEndIntervalInDays = async () => {
    const electionStartEndInterval = Number(
      (((await contract?.ELECTION_START_END_INTERVAL()) || 0) as bigint)
        / BigInt(TimeQuantities.DAY)
    );
    return electionStartEndInterval;
  };

  const getElectionsStartDate = async () => Number(await contract?.electionsStartDate());

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
