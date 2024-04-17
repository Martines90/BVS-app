/* eslint-disable import/prefer-default-export */

export const MOCK_REGISTER_AS_CANDIDATE_FEE = 100000;
export const MOCK_CITIZENSHIP_APPLICATION_FEE = 10000;

export const mockContractFunctions = {
  getCitizenRoleApplicationFee: jest.fn(() => Promise.resolve(MOCK_CITIZENSHIP_APPLICATION_FEE)),
  getElectionCandidateApplicationFee: jest.fn(
    () => Promise.resolve(MOCK_REGISTER_AS_CANDIDATE_FEE)
  ),
  getElectionsStartDate: jest.fn(() => Promise.resolve(0)),
  isAccountAppliedForCitizenship: jest.fn(() => Promise.resolve(false)),
  isCandidateAlreadyApplied: jest.fn(() => Promise.resolve(false)),
  applyForCitizenshipRole: jest.fn(() => Promise.resolve()),
  applyForElectionsAsCandidate: jest.fn(() => Promise.resolve()),
  hasRole: jest.fn(() => Promise.resolve(false))
};
