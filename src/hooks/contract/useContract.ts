/* eslint-disable no-await-in-loop */
/* eslint-disable max-lines */
import { EMPTY_BYTES_32 } from '@global/constants/blockchain';
import { TimeQuantities } from '@global/constants/general';
import { isValidAddress } from '@global/helpers/validators';
import { ContractRoleskeccak256, USER_ROLES } from '@global/types/user';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import { AddressLike, BytesLike } from 'ethers';
import { articleRawDataToArticle } from './helpers/helpers';
import {
  ContractInteractionProps, ProConArticle, Vote, Voting
} from './types';

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

  const assignArticleToVoting = async (
    votingKey: BytesLike,
    ipfsHash: string,
    isVoteOnA: boolean
  ) => {
    await contract?.publishProConArticle(votingKey, ipfsHash, isVoteOnA);
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

  const addAnswersToVotingContent = async (votingKey: BytesLike, answersHash: BytesLike[]) => {
    await contract?.addKeccak256HashedAnswersToVotingContent(votingKey, answersHash);
  };

  const approveVoting = async (votingKey: BytesLike) => {
    await contract?.approveVoting(votingKey);
  };

  const assignQuizIpfsHashToVoting = async (votingKey: BytesLike, quizIpfsHash: string) => {
    await contract?.assignQuizIpfsHashToVoting(votingKey, quizIpfsHash);
  };

  const completeVotingContentCheckQuiz = async (votingKey: BytesLike, answers: string[]) => {
    await contract?.completeContentReadQuiz(BigInt(1), votingKey, EMPTY_BYTES_32, answers);
  };

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

  const getAccountVote = async (votingKey: BytesLike, accountAddress: AddressLike) => {
    const vote = await contract?.votes(accountAddress, votingKey);

    return {
      voted: vote?.[0],
      isContentQuizCompleted: vote?.[1]
    } as Vote;
  };

  const voteOnVoting = async (votingKey: BytesLike, voteOnA: boolean) => {
    await contract?.voteOnVoting(votingKey, voteOnA);
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

  // Articles

  const addAnswersToArticleContent = async (
    votingKey: BytesLike,
    articleKey: BytesLike,
    answers: BytesLike[]
  ) => {
    await contract?.addKeccak256HashedAnswersToArticle(
      votingKey,
      articleKey,
      answers
    );
  };

  const assignQuizIpfsHashToArticle = async (
    votingKey: BytesLike,
    articleKey: BytesLike,
    quizIpfsHash: string
  ) => {
    await contract?.assignQuizIpfsHashToArticleOrResponse(
      votingKey,
      articleKey,
      quizIpfsHash,
      true
    );
  };

  const assignResponseIpfsHashToArticle = async (
    votingKey: BytesLike,
    articleKey: BytesLike,
    responseIpfsHash: string
  ) => {
    await contract?.publishProConArticleResponse(
      votingKey,
      articleKey,
      responseIpfsHash
    );
  };
  // ********* GETTERS ***********
  const getAccountVotingRelatedQuestionIndexes = async (
    votingKey: string,
    accountKey: AddressLike
  ) => ((
    (await contract?.getAccountVotingQuizAnswerIndexes(votingKey, accountKey)) || []
  ) as bigint[]).map((item) => Number(item));

  const getAccountVotingScore = async (votingKey: BytesLike, accountAddress: AddressLike) => Number(
    (await contract?.calculateVoteScore(votingKey, accountAddress)) || 0
  );

  const getAdministratorAtIndex = async (index: number) => (
    (await contract?.admins(index))
  ) as AddressLike;

  const getArticleAtKey = async (votingKey: BytesLike, articleKey: BytesLike) => {
    const articleData = await contract?.proConArticles(votingKey, articleKey);
    if (articleData) {
      return articleRawDataToArticle(String(articleKey), articleData);
    }
    return undefined;
  };

  // FIXME: add to BVS articleContentReadCheckAnswers[articleKey].length function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getArticleContentReadCheckAnswersLength = async (articleKey: BytesLike) => Number(
    0
    // await contract?.articleContentReadCheckAnswers(articleKey, 0) !== '' ? 10 : 0
    //  contract.articleContentReadCheckAnswers[articleKey].length
  );

  const getApproveVotingMinTimeAfterLimit = async () => Number(
    await contract?.APPROVE_VOTING_BEFORE_IT_STARTS_LIMIT()
  ) * 1000;

  const getCitizenAtIndex = async (index: number) => (
    (await contract?.citizens(index))
  ) as AddressLike;

  const getFirstVotingCycleStartDate = async () => Number(
    await contract?.firstVotingCycleStartDate()
  ) * 1000;

  const getPoliticalActorPublishArticleToVotingsCount = async (
    account: AddressLike,
    votingKey: BytesLike
  ) => Number(
    await contract?.publishArticleToVotingsCount(account, votingKey) || 0
  );

  const getVotingAssignedArticlesPublishedByAccount = async (
    votingKey: BytesLike,
    account: AddressLike
  ) => {
    const totalNNumOfArticles = Number(await contract?.getArticleKeysLength() || 0);
    let startExitCount = false;
    const articles: ProConArticle[] = [];
    let exitCounter = 0;

    for (let i = totalNNumOfArticles - 1; i >= 0 && exitCounter < 20; i--) {
      const articleKey = await contract?.articleKeys(BigInt(i)) || '';
      const votingRelatedArticle = await contract?.proConArticles(votingKey, articleKey);
      // FIX ME: make publisher to Address type instead of string
      if (votingRelatedArticle?.[3].toLowerCase() === String(account).toLowerCase()) {
        articles.push(articleRawDataToArticle(articleKey, votingRelatedArticle));
        startExitCount = true;
      }

      if (startExitCount) {
        exitCounter++;
      }
    }
    return articles;
  };

  const getVotingCycleMinCloseToTheEndTime = async () => Number(
    await contract?.NEW_VOTING_PERIOD_MIN_SCHEDULE_AHEAD_TIME() || 0
  ) * 1000;

  const getMinTotalQuizCheckAnswers = async () => Number(
    (await contract?.MIN_TOTAL_CONTENT_READ_CHECK_ANSWER()) || 0
  );

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

  const getVotingDuration = async () => Number(
    await contract?.VOTING_DURATION() || 0
  ) * 1000;

  // FIXME: build and release a new contract with method: getVotingContentReadCheckAnswersLength
  const getVotingContentReadCheckAnswersLength = async (votingKey: BytesLike) => (
    0// await contract?.votingContentReadCheckAnswers(votingKey, 0) !== '' ? 10 : 0
    // await contract?.getVotingContentReadCheckAnswersLength(votingKey) || []
  );

  const getVotingContentCheckAnswerAtIndex = async (votingKey: BytesLike, index: number) => (
    await contract?.votingContentReadCheckAnswers(votingKey, BigInt(index)) || ''
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
    getAccountVote,
    getAccountVotingRelatedQuestionIndexes,
    getAccountVotingScore,
    getAdministratorAtIndex,
    getApproveVotingMinTimeAfterLimit,
    getArticleAtKey,
    getArticleContentReadCheckAnswersLength,
    getCitizenAtIndex,
    getMinTotalQuizCheckAnswers,
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
    getVotingDuration,
    getVotingCycleMinCloseToTheEndTime,
    getVotingAtKey,
    getPoliticalActorAtIndex,
    getPoliticalActorVotingCredits,
    getPoliticalActorVotingCycleVoteStartCount,
    getPoliticalActorPublishArticleToVotingsCount,
    getVotingAssignedArticlesPublishedByAccount,
    getVotedOnCandidatePublicKey,
    getVotingContentCheckAnswerAtIndex,
    getVotingContentReadCheckAnswersLength,
    getVotingCycleInterval,
    getVotingKeyAtIndex,
    addAnswersToArticleContent,
    addAnswersToVotingContent,
    approveVoting,
    assignArticleToVoting,
    assignQuizIpfsHashToVoting,
    assignQuizIpfsHashToArticle,
    assignResponseIpfsHashToArticle,
    applyForCitizenshipRole,
    closeElections,
    completeVotingContentCheckQuiz,
    grantCitizenRole,
    applyForElectionsAsCandidate,
    hasRole,
    scheduleNextElections,
    scheduleNewVoting,
    setFirstVotingCycleStartDate,
    voteOnElectionsCandidate,
    voteOnVoting,
    isAccountAlreadyVoted,
    isAccountAppliedForCitizenship,
    isCandidateAlreadyApplied,
    isHashMatchWithCitizenshipApplicationHash,
    isThereOngoingElections
  };
};

export default useContract;
