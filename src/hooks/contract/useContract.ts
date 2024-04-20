import { TimeQuantities } from '@global/constants/general';
import { isValidAddress } from '@global/helpers/validators';
import { ContractRoleskeccak256, USER_ROLES } from '@global/types/user';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { AddressLike, BytesLike } from 'ethers';
import { ContractInteractionProps } from './types';

const useContract = (): ContractInteractionProps => {
  const { userState } = useUserContext();

  const { contract } = userState;

  // Roles

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

  // Elections

  const applyForElectionsAsCandidate = async (
    applicationFee: number
  ) => {
    await userState.contract?.applyForElections(
      {
        value: applicationFee,
        from: userState.walletAddress
      }
    );
  };

  const isThereOngoingElections = async () => (await contract?.electionsStartDate()) !== BigInt(0);

  const isAccountAlreadyVoted = async () => isValidAddress(await contract?.electionVotes(userState.walletAddress || '0x0'));

  const isCandidateAlreadyApplied = async (candidatePublicKey: AddressLike) => (
    Number(await contract?.electionCandidateScores(candidatePublicKey)) > 0
  );

  const scheduleNextElections = async (fromDate: number, toDate: number) => {
    await contract?.scheduleNextElections(BigInt(fromDate), BigInt(toDate));
  };

  // ********* GETTERS ***********

  const getNumberOfElectionCandidates = async () => Number(
    (await contract?.getElectionCandidatesSize()) || 0
  );

  const getElectionsCandidatePublicKeyAtIndex = async (index: number) => (
    (await contract?.electionCandidates(BigInt(index)) || '0x0')
  ) as AddressLike;

  const getElectionCandidateScore = async (accountAddress: AddressLike) => Number(
    (await contract?.electionCandidateScores(accountAddress) || 0)
  );

  const getCitizenRoleApplicationFee = async () => Number(
    (await contract?.citizenRoleApplicationFee()) || 0
  );

  const getElectionCandidateApplicationFee = async () => Number(
    (await contract?.electionsCandidateApplicationFee()) || 0
  );

  const getElectionStartEndIntervalInDays = async () => {
    const electionStartEndInterval = Number(
      (((await contract?.ELECTION_START_END_INTERVAL()) || 0) as bigint)
        / BigInt(TimeQuantities.DAY)
    );
    return electionStartEndInterval;
  };

  const getElectionsStartDate = async () => Number(await contract?.electionsStartDate()) * 1000;

  const getElectionsEndDate = async () => Number(await contract?.electionsEndDate()) * 1000;

  const getVotedOnCandidatePublicKey = async () => await contract?.electionVotes(userState.walletAddress || '0x0') as AddressLike;

  return {
    contract,
    getCitizenRoleApplicationFee,
    getElectionStartEndIntervalInDays,
    getElectionsStartDate,
    getElectionsEndDate,
    getElectionCandidateApplicationFee,
    getElectionsCandidatePublicKeyAtIndex,
    getElectionCandidateScore,
    getNumberOfElectionCandidates,
    getVotedOnCandidatePublicKey,
    applyForCitizenshipRole,
    grantCitizenRole,
    applyForElectionsAsCandidate,
    hasRole,
    isAccountAlreadyVoted,
    isAccountAppliedForCitizenship,
    isCandidateAlreadyApplied,
    isHashMatchWithCitizenshipApplicationHash,
    isThereOngoingElections,
    scheduleNextElections
  };
};

export default useContract;
