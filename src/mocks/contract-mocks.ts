/* eslint-disable import/prefer-default-export */

export const MOCK_REGISTER_AS_CANDIDATE_FEE = 100000;
export const MOCK_CITIZENSHIP_APPLICATION_FEE = 10000;
export const MOCK_ELECTIONS_START_END_INTERVAL_IN_DAYS = 30;

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

export const mockContractFunctions = {
  getCitizenRoleApplicationFee: jest.fn(() => Promise.resolve(MOCK_CITIZENSHIP_APPLICATION_FEE)),
  getElectionCandidateApplicationFee: jest.fn(
    () => Promise.resolve(MOCK_REGISTER_AS_CANDIDATE_FEE)
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
  getVotedOnCandidatePublicKey: jest.fn(() => Promise.resolve(MOCK_NON_EXISTING_ADDRESS)),
  isAccountAppliedForCitizenship: jest.fn(() => Promise.resolve(false)),
  isThereOngoingElections: jest.fn(() => Promise.resolve(false)),
  isCandidateAlreadyApplied: jest.fn(() => Promise.resolve(false)),
  applyForCitizenshipRole: jest.fn(() => Promise.resolve()),
  applyForElectionsAsCandidate: jest.fn(() => Promise.resolve()),
  scheduleNextElections: jest.fn(() => Promise.resolve()),
  hasRole: jest.fn(() => Promise.resolve(false))
};
