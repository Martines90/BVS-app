import { TimeQuantities } from '@global/constants/general';
import { isValidAddress } from '@global/helpers/validators';
import { ContractRoleskeccak256, USER_ROLES } from '@global/types/user';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { AddressLike, BytesLike } from 'ethers';
import { ContractInteractionProps, Voting } from './types';

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

  // Votings

  const setFirstVotingCycleStartDate = async (date: number) => {
    await contract?.setFirstVotingCycleStartDate(date);
  };

  const scheduleNewVoting = async (ipfsHash: string, date: number, targetBudget?: number) => {
    await contract?.scheduleNewVoting(ipfsHash, date, targetBudget || 0);
  };

  const getVotingAtKey = async (votingKey: BytesLike) => {
    const voting = await contract?.votings(votingKey) || [];
    return {
      approved: Boolean(voting[0]),
      cancelled: Boolean(voting[1]),
      key: voting[2],
      budget: Number(voting[3]),
      voteCount: Number(voting[4]),
      creator: voting[5],
      contentIpfsHash: voting[6],
      startDate: Number(voting[7]) * 1000,
      voteOnAScore: Number(voting[8]),
      voteOnBScore: Number(voting[9]),
      votingContentCheckQuizIpfsHash: voting[10]
    } as Voting;
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

  const closeElections = async () => {
    await contract?.closeElections();
  };

  const isThereOngoingElections = async () => (await contract?.electionsStartDate()) !== BigInt(0);

  const isAccountAlreadyVoted = async () => isValidAddress(await contract?.electionVotes(userState.walletAddress || '0x0'));

  const isCandidateAlreadyApplied = async (candidatePublicKey: AddressLike) => (
    Number(await contract?.electionCandidateScores(candidatePublicKey)) > 0
  );

  const scheduleNextElections = async (fromDate: number, toDate: number) => {
    await contract?.scheduleNextElections(BigInt(fromDate), BigInt(toDate));
  };

  const voteOnElectionsCandidate = async (candidatePuplicKey: AddressLike) => {
    await contract?.voteOnElections(candidatePuplicKey);
  };

  // ********* GETTERS ***********
  const getAdministratorAtIndex = async (index: number) => (
    (await contract?.admins(index))
  ) as AddressLike;

  const getCitizenAtIndex = async (index: number) => (
    (await contract?.citizens(index))
  ) as AddressLike;

  const getFirstVotingCycleStartDate = async () => Number(
    await contract?.firstVotingCycleStartDate()
  ) * 1000;

  const getVotingCycleMinCloseToTheEndTime = async () => Number(
    await contract?.NEW_VOTING_PERIOD_MIN_SCHEDULE_AHEAD_TIME() || 0
  ) * 1000;

  const getNumberOfAdministrators = async () => Number(
    (await contract?.getAdminsSize()) || 0
  );

  const getNumberOfElectionCandidates = async () => Number(
    (await contract?.getElectionCandidatesSize()) || 0
  );

  const getNumberOfCitizens = async () => Number(
    (await contract?.getCitizensSize()) || 0
  );

  const getNumberOfPoliticalActors = async () => Number(
    (await contract?.getPoliticalActorsSize()) || 0
  );

  const getNumberOfVotings = async () => Number(
    (await contract?.getVotingKeysLength()) || 0
  );

  const getPoliticalActorVotingCredits = async (accountKey: AddressLike) => Number(
    await contract?.politicalActorVotingCredits(accountKey) || 0
  );

  const getPoliticalActorVotingCycleVoteStartCount = async (
    accountKey: AddressLike,
    votingCycleCount: number
  ) => Number(
    await contract?.votingCycleStartVoteCount(votingCycleCount, accountKey) || 0
  );

  const getVotingCycleInterval = async () => Number(
    await contract?.VOTING_CYCLE_INTERVAL() || 0
  ) * 1000;

  const getVotingKeyAtIndex = async (index: number) => (
    (await contract?.votingKeys(BigInt(index)) || '0x0')
  ) as AddressLike;

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

  const getPoliticalActorAtIndex = async (index: number) => (
    (await contract?.politicalActors(index))
  ) as AddressLike;

  const getVotedOnCandidatePublicKey = async () => await contract?.electionVotes(userState.walletAddress || '0x0') as AddressLike;

  return {
    contract,
    getAdministratorAtIndex,
    getCitizenAtIndex,
    getNumberOfAdministrators,
    getNumberOfCitizens,
    getNumberOfPoliticalActors,
    getNumberOfVotings,
    getCitizenRoleApplicationFee,
    getElectionStartEndIntervalInDays,
    getElectionsStartDate,
    getElectionsEndDate,
    getElectionCandidateApplicationFee,
    getElectionsCandidatePublicKeyAtIndex,
    getElectionCandidateScore,
    getFirstVotingCycleStartDate,
    getNumberOfElectionCandidates,
    getVotingCycleMinCloseToTheEndTime,
    getVotingAtKey,
    getPoliticalActorAtIndex,
    getPoliticalActorVotingCredits,
    getPoliticalActorVotingCycleVoteStartCount,
    getVotedOnCandidatePublicKey,
    getVotingCycleInterval,
    getVotingKeyAtIndex,
    applyForCitizenshipRole,
    closeElections,
    grantCitizenRole,
    applyForElectionsAsCandidate,
    hasRole,
    scheduleNextElections,
    scheduleNewVoting,
    setFirstVotingCycleStartDate,
    voteOnElectionsCandidate,
    isAccountAlreadyVoted,
    isAccountAppliedForCitizenship,
    isCandidateAlreadyApplied,
    isHashMatchWithCitizenshipApplicationHash,
    isThereOngoingElections
  };
};

export default useContract;
