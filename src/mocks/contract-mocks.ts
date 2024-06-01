/* eslint-disable import/prefer-default-export */

import { GWEI_TO_WEI } from '@global/constants/blockchain';
import { TimeQuantities } from '@global/constants/general';
import { toKeccak256HashToBytes32 } from '@global/helpers/hash-manipulation';
import { ProConArticle } from '@hooks/contract/types';
import { BytesLike } from 'ethers';
import { MOCK_FUTURE_TIMESTAMP } from './common-mocks';

export const MOCK_REGISTER_AS_CANDIDATE_FEE = 100000;
export const MOCK_CITIZENSHIP_APPLICATION_FEE = 10000;
export const MOCK_ELECTIONS_START_END_INTERVAL_IN_DAYS = 30;

export const mockAccountPublicKeys = [
  '0xc89dC69841e991BCC4Ecd73155bF80d47F6F163E',
  '0x5eF1aFB2aC0309F3cfA240Bf4eF87cD09E987Ae8',
  '0x1b0319Cdf99B9DB06b161154071553d08c5Aa8d2',
  '0x4C9a72ee6B5f98E918D0A243bB7a22BeE842D23f',
  '0x8A82b94BB3d7a6B683B6f3D5882a38539e368668',
  '0x9224326f376277F833F261aEAd3fBf968df3464F',
  '0x156eCdeBEf439EE3B40679a0D8345899cFB1CAe7',
  '0x316e111f18eF48089109eA34f4D956dEAd4D4183',
  '0xE88F7C5846a7c2281F22e09e2fDF7e416F982a6C',
  '0xAA769DB7816cC23BCbe029dc26a16BeB72e44008',
  '0x9224326f376277F833F261aEAd3frRT38df3464F'
];

export const MOCK_CANDIDATE_ACCOUNT_KEYS = [
  '0xf40eb48d6b4964072dad455aadf0f84e94d00a19695865bbe226f9b560c9ed76',
  '0x69fcf89b49fb124ae6f6004a7028184cc8620f1d6e9daa9f97098ef693a03f80',
  '0xcb926b6ec105a6c4a04a64dd1edab6b2a52c4ad5ec91ea1155ed80e43d4b5753'
];

export const MOCK_CANDIDATE_SCORES: { [key: string]: number } = {
  '0xf40eb48d6b4964072dad455aadf0f84e94d00a19695865bbe226f9b560c9ed76': 133,
  '0x69fcf89b49fb124ae6f6004a7028184cc8620f1d6e9daa9f97098ef693a03f80': 15,
  '0xcb926b6ec105a6c4a04a64dd1edab6b2a52c4ad5ec91ea1155ed80e43d4b5753': 67
};

export const MOCK_NON_EXISTING_ADDRESS = '0x0000000000000000000000000000000000000000';

// getVotingKeyAtIndex, getVotingAtKey, getNumberOfVotings
export const MOCK_VOTING_KEY_HASHES = [
  toKeccak256HashToBytes32(
    'jnksadjnsadkjskndeoio'
  ) as string,
  toKeccak256HashToBytes32(
    'háptgmo54ö53töööögffmdl'
  ) as string,
  toKeccak256HashToBytes32(
    'oirpmrwp9ö4kpfsfpdfmllksm'
  ) as string,
  toKeccak256HashToBytes32(
    'fsjdfljdfscmcdldklscdfs'
  ) as string
];

export const MOCK_ARTICLE_KEYS = [
  toKeccak256HashToBytes32(
    'kldsfllkdfsjlkdsfkékl'
  ) as string,
  toKeccak256HashToBytes32(
    'mfdslkdmvcklsvdknvsdnor'
  ) as string,
  toKeccak256HashToBytes32(
    '94jfd2ösdkndlksdlfkm'
  ) as string
];

export const MOCK_VOTINGS = {
  [MOCK_VOTING_KEY_HASHES[0]]: {
    approved: true,
    cancelled: false,
    key: MOCK_VOTING_KEY_HASHES[0],
    budget: 100,
    voteCount: 44,
    creator: mockAccountPublicKeys[0],
    contentIpfsHash: 'content-ipfs-hash-0',
    startDate: MOCK_FUTURE_TIMESTAMP,
    voteOnAScore: 12445,
    voteOnBScore: 23334,
    votingContentCheckQuizIpfsHash: 'content-check-ipfs-hash-0',
    actualNumberOfCitizens: 10
  },
  [MOCK_VOTING_KEY_HASHES[1]]: {
    approved: false,
    cancelled: false,
    key: MOCK_VOTING_KEY_HASHES[1],
    budget: 0,
    voteCount: 12,
    creator: mockAccountPublicKeys[1],
    contentIpfsHash: 'content-ipfs-hash-1',
    startDate: (MOCK_FUTURE_TIMESTAMP - TimeQuantities.WEEK * 1000),
    voteOnAScore: 333,
    voteOnBScore: 45,
    votingContentCheckQuizIpfsHash: 'content-check-ipfs-hash-1',
    actualNumberOfCitizens: 10
  },
  [MOCK_VOTING_KEY_HASHES[2]]: {
    approved: true,
    cancelled: false,
    key: MOCK_VOTING_KEY_HASHES[2],
    budget: 0,
    voteCount: 1899,
    creator: mockAccountPublicKeys[2],
    contentIpfsHash: 'content-ipfs-hash-2',
    startDate: (MOCK_FUTURE_TIMESTAMP + TimeQuantities.WEEK * 1000),
    voteOnAScore: 333,
    voteOnBScore: 45,
    votingContentCheckQuizIpfsHash: 'content-check-ipfs-hash-2',
    actualNumberOfCitizens: 10
  },
  [MOCK_VOTING_KEY_HASHES[3]]: {
    approved: false,
    cancelled: false,
    key: MOCK_VOTING_KEY_HASHES[3],
    budget: 1999 * GWEI_TO_WEI,
    voteCount: 0,
    creator: mockAccountPublicKeys[1],
    contentIpfsHash: '',
    startDate: (MOCK_FUTURE_TIMESTAMP + (TimeQuantities.WEEK + TimeQuantities.DAY) * 1000),
    voteOnAScore: 0,
    voteOnBScore: 0,
    votingContentCheckQuizIpfsHash: '',
    actualNumberOfCitizens: 10
  }
};

export const MOCK_PRO_CON_ARTICLES: ProConArticle[] = [
  ...MOCK_ARTICLE_KEYS.map((articleKey, index) => (
    {
      articleKey,
      votingKey: MOCK_VOTING_KEY_HASHES[0],
      isArticleApproved: false,
      isResponseApproved: false,
      publisher: mockAccountPublicKeys[0],
      articleIpfsHash: `article-test-ipfs-hash-${index}`,
      isVoteOnA: true,
      responseStatementIpfsHash: index > 0 ? `response-statement-ipfs-hash-${index}` : '',
      articleContentCheckQuizIpfsHash: index > 1 ? `article-content-check-quiz-ipfs-hash-${index}` : '',
      responseContentCheckQuizIpfsHash: index > 1 ? `response-content-test-ipfs-hash-${index}` : ''
    }
  ))
];

export const mockContractFunctions = {
  getAccountArticleRelatedQuestionIndexes: jest.fn(() => Promise.resolve([3, 9, 4, 1, 2])),
  getAccountArticleResponseRelatedQuestionIndexes: jest.fn(() => Promise.resolve([3, 9, 1, 6, 5])),
  getAccountVotingScore: jest.fn(() => Promise.resolve(0)),
  getAccountVotingRelatedQuestionIndexes: jest.fn(() => Promise.resolve([2, 6, 10, 8, 1])),
  getAccountVote: jest.fn(() => Promise.resolve({ voted: false, isContentQuizCompleted: false })),
  getApproveVotingMinTimeAfterLimit: jest.fn(() => Promise.resolve(TimeQuantities.DAY * 3 * 1000)),
  getArticleAtKey: jest.fn(
    (
      votingKey: BytesLike,
      articleKey: BytesLike
    ) => MOCK_PRO_CON_ARTICLES.find(
      (mArticle) => mArticle.articleKey === articleKey && mArticle.votingKey === votingKey
    )
  ),
  getArticleContentReadCheckAnswersLength: jest.fn(() => Promise.resolve(0)),
  getArticleResponseContentReadCheckAnswersLength: jest.fn(() => Promise.resolve(0)),
  getAdministratorAtIndex: jest.fn(
    (index: number) => Promise.resolve(mockAccountPublicKeys[index])
  ),
  getVotingAssignedArticlesPublished: jest.fn(
    () => Promise.resolve(MOCK_PRO_CON_ARTICLES)
  ),
  getVotingContentReadCheckAnswersLength: jest.fn(() => Promise.resolve(0)),
  getVotingCycleInterval: jest.fn(() => Promise.resolve(30 * TimeQuantities.DAY * 1000)),
  getVotingCycleMinCloseToTheEndTime: jest.fn(
    () => Promise.resolve(10 * TimeQuantities.DAY * 1000)
  ),
  getCitizenAtIndex: jest.fn((index: number) => Promise.resolve(mockAccountPublicKeys[index])),
  getPoliticalActorPublishArticleToVotingsCount: jest.fn(() => Promise.resolve(3)),
  getPoliticalActorVotingCredits: jest.fn(() => Promise.resolve(3)),
  getPoliticalActorVotingCycleVoteStartCount: jest.fn(() => Promise.resolve(1)),
  getFirstVotingCycleStartDate: jest.fn(() => Promise.resolve(0)),
  getMinTotalQuizCheckAnswers: jest.fn(() => Promise.resolve(10)),
  getMinPercentageOfVotes: jest.fn(() => Promise.resolve(10)),
  getNumberOfCitizens: jest.fn(() => Promise.resolve(mockAccountPublicKeys.length)),
  getNumberOfAdministrators: jest.fn(() => Promise.resolve(mockAccountPublicKeys.length)),
  getNumberOfPoliticalActors: jest.fn(() => Promise.resolve(mockAccountPublicKeys.length)),
  getCitizenRoleApplicationFee: jest.fn(() => Promise.resolve(MOCK_CITIZENSHIP_APPLICATION_FEE)),
  getElectionCandidateApplicationFee: jest.fn(
    () => Promise.resolve(BigInt(MOCK_REGISTER_AS_CANDIDATE_FEE))
  ),
  getElectionsCandidatePublicKeyAtIndex: jest.fn(
    (index) => Promise.resolve(MOCK_CANDIDATE_ACCOUNT_KEYS[index])
  ),
  getElectionCandidateScore: jest.fn(
    (publicKey: string) => MOCK_CANDIDATE_SCORES[publicKey]
  ),
  getElectionsStartDate: jest.fn(() => Promise.resolve(0)),
  getElectionsEndDate: jest.fn(() => Promise.resolve(0)),
  getElectionStartEndIntervalInDays: jest.fn(
    () => Promise.resolve(MOCK_ELECTIONS_START_END_INTERVAL_IN_DAYS)
  ),
  getNumberOfElectionCandidates: jest.fn(() => Promise.resolve(MOCK_CANDIDATE_ACCOUNT_KEYS.length)),
  getNumberOfVotings: jest.fn(() => Promise.resolve(MOCK_VOTING_KEY_HASHES.length)),
  getPoliticalActorAtIndex:
    jest.fn((index: number) => Promise.resolve(mockAccountPublicKeys[index])),
  getVotedOnCandidatePublicKey: jest.fn(() => Promise.resolve(MOCK_NON_EXISTING_ADDRESS)),
  getVotingAtKey: jest.fn((key: BytesLike) => Promise.resolve(MOCK_VOTINGS[key as string])),
  getVotingDuration: jest.fn(() => Promise.resolve(14 * TimeQuantities.DAY * 1000)),
  getVotingKeyAtIndex: jest.fn((index: number) => Promise.resolve(MOCK_VOTING_KEY_HASHES[index])),
  assignArticleToVoting: jest.fn(() => Promise.resolve()),
  assignResponseIpfsHashToArticle: jest.fn(() => Promise.resolve()),
  completeArticleContentCheckQuiz: jest.fn(() => Promise.resolve()),
  completeArticleResponseContentCheckQuiz: jest.fn(() => Promise.resolve()),
  isAccountAppliedForCitizenship: jest.fn(() => Promise.resolve(false)),
  isThereOngoingElections: jest.fn(() => Promise.resolve(false)),
  isCandidateAlreadyApplied: jest.fn(() => Promise.resolve(false)),
  isVotingWon: jest.fn(() => Promise.resolve(true)),
  addAnswersToVotingContent: jest.fn(() => Promise.resolve()),
  addAnswersToArticleContent: jest.fn(() => Promise.resolve()),
  addAnswersToResponseContent: jest.fn(() => Promise.resolve()),
  applyForCitizenshipRole: jest.fn(() => Promise.resolve()),
  applyForElectionsAsCandidate: jest.fn(() => Promise.resolve()),
  approveVoting: jest.fn(() => Promise.resolve()),
  assignQuizIpfsHashToArticle: jest.fn(() => Promise.resolve()),
  completeVotingContentCheckQuiz: jest.fn(() => Promise.resolve()),
  assignQuizIpfsHashToVoting: jest.fn(() => Promise.resolve()),
  assignQuizIpfsHashToResponse: jest.fn(() => Promise.resolve()),
  scheduleNextElections: jest.fn(() => Promise.resolve()),
  scheduleNewVoting: jest.fn(() => Promise.resolve()),
  setFirstVotingCycleStartDate: jest.fn(() => Promise.resolve()),
  hasRole: jest.fn(() => Promise.resolve(false)),
  voteOnElectionsCandidate: jest.fn(() => Promise.resolve()),
  voteOnVoting: jest.fn(() => Promise.resolve())
};
