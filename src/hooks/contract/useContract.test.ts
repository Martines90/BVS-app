/* eslint-disable max-lines */
import { TimeQuantities } from '@global/constants/general';
import { getBytes32keccak256Hash } from '@global/helpers/hash-manipulation';
import { ContractRoleskeccak256, USER_ROLES } from '@global/types/user';
import {
  MOCK_CITIZENSHIP_APPLICATION_FEE,
  MOCK_NON_EXISTING_ADDRESS,
  MOCK_REGISTER_AS_CANDIDATE_FEE
} from '@mocks/contract-mocks';
import { AddressLike } from 'ethers';
import useContract from './useContract';

const mockFutureTimestamp = 2533566483;
const mockAccountKey = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const mockNotRegisteredAccountKey = '0x914a73ad0b138eedf80704f9ccd81be56f33bbd5f8b371c82de3b6b6a5a23ff7';

const mockApplyForCitizenshipHash = getBytes32keccak256Hash(
  `test@email.com${mockAccountKey}`
);

const mockCitizens: AddressLike[] = [
  mockAccountKey
];

const mockContract = {
  ELECTION_START_END_INTERVAL: jest.fn(() => Promise.resolve(BigInt(TimeQuantities.MONTH))),
  applyForCitizenshipRole: jest.fn(() => Promise.resolve()),
  applyForElections: jest.fn(() => Promise.resolve()),
  closeElections: jest.fn(() => Promise.resolve()),
  citizens: jest.fn((index) => Promise.resolve(mockCitizens[index])),
  electionsCandidateApplicationFee: jest.fn(
    () => Promise.resolve(MOCK_REGISTER_AS_CANDIDATE_FEE)
  ),
  electionCandidateScores: jest.fn((accountKey) => {
    if (accountKey === mockAccountKey) {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  electionCandidates: jest.fn((index) => {
    if (index === BigInt(1)) {
      return Promise.resolve(mockAccountKey);
    }
    return Promise.resolve(MOCK_NON_EXISTING_ADDRESS);
  }),
  electionVotes: jest.fn(() => Promise.resolve(MOCK_NON_EXISTING_ADDRESS)),
  grantCitizenRole: jest.fn(() => Promise.resolve()),
  hasRole: jest.fn(() => Promise.resolve(true)),
  getCitizensSize: jest.fn(() => Promise.resolve(3)),
  getElectionCandidatesSize: jest.fn(() => Promise.resolve(0)),
  citizenshipApplications: jest.fn((publicKey) => {
    if (publicKey === mockAccountKey) {
      return Promise.resolve(mockApplyForCitizenshipHash);
    }
    return Promise.resolve(MOCK_NON_EXISTING_ADDRESS);
  }),
  electionsStartDate: jest.fn(() => Promise.resolve(BigInt(0))),
  electionsEndDate: jest.fn(() => Promise.resolve(BigInt(0))),
  getPoliticalActorsSize: jest.fn(() => Promise.resolve(BigInt(3))),
  scheduleNextElections: jest.fn(() => Promise.resolve()),
  politicalActors: jest.fn((index) => Promise.resolve(mockCitizens[index])),
  voteOnElections: jest.fn(() => Promise.resolve()),
  citizenRoleApplicationFee: jest.fn(() => Promise.resolve(
    BigInt(MOCK_CITIZENSHIP_APPLICATION_FEE)
  ))
};

jest.mock('@hooks/context/userContext/UserContext', () => ({
  useUserContext: () => ({
    userState: {
      contract: mockContract,
      walletAddress: mockAccountKey
    }
  })
}));

describe('useContract', () => {
  it('should exists', () => {
    expect(useContract).toBeDefined();
  });

  describe('roles', () => {
    describe('applyForCitizenshipRole', () => {
      it('should call applyForCitizenshipRole with proper values', async () => {
        const { applyForCitizenshipRole } = useContract();

        await applyForCitizenshipRole(
          mockApplyForCitizenshipHash,
          MOCK_CITIZENSHIP_APPLICATION_FEE
        );

        expect(mockContract.applyForCitizenshipRole).toHaveBeenCalledWith(
          mockApplyForCitizenshipHash,
          { from: mockAccountKey, value: MOCK_CITIZENSHIP_APPLICATION_FEE }
        );
      });
    });

    describe('grantCitizenRole', () => {
      it('should call grantCitizenRole with proper values', async () => {
        const { grantCitizenRole } = useContract();

        await grantCitizenRole(mockAccountKey, mockApplyForCitizenshipHash);

        expect(mockContract.grantCitizenRole).toHaveBeenCalledWith(
          mockAccountKey,
          mockApplyForCitizenshipHash,
          false
        );
      });
    });

    describe('hasRole', () => {
      it('should call hasRole with proper values', async () => {
        const { hasRole } = useContract();

        await hasRole(USER_ROLES.CITIZEN, mockAccountKey);

        expect(mockContract.hasRole).toHaveBeenCalledWith(
          ContractRoleskeccak256.citizen,
          mockAccountKey
        );
      });
    });

    describe('isAccountAppliedForCitizenship', () => {
      it('should return true when public is in citizenshipApplications', async () => {
        const { isAccountAppliedForCitizenship } = useContract();

        expect(await isAccountAppliedForCitizenship(mockAccountKey)).toBe(true);
        expect(mockContract.citizenshipApplications).toHaveBeenCalledWith(mockAccountKey);
      });

      it('should return false when public is not in citizenshipApplications', async () => {
        const { isAccountAppliedForCitizenship } = useContract();

        const mockNonMatchAccountKey = '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6';

        expect(await isAccountAppliedForCitizenship(mockNonMatchAccountKey)).toBe(false);
        expect(mockContract.citizenshipApplications).toHaveBeenCalledWith(mockNonMatchAccountKey);
      });
    });

    describe('isHashMatchWithCitizenshipApplicationHash', () => {
      it('should return true when citizenshipApplications registered account has the validation hash', async () => {
        const { isHashMatchWithCitizenshipApplicationHash } = useContract();

        expect(
          await isHashMatchWithCitizenshipApplicationHash(
            mockAccountKey,
            mockApplyForCitizenshipHash
          )
        ).toBe(true);
        expect(mockContract.citizenshipApplications).toHaveBeenCalledWith(mockAccountKey);
      });

      it('should return false when citizenshipApplications has no registered account found', async () => {
        const { isHashMatchWithCitizenshipApplicationHash } = useContract();

        const mockNonMatchAccountKey = '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6';

        expect(
          await isHashMatchWithCitizenshipApplicationHash(
            mockNonMatchAccountKey,
            mockApplyForCitizenshipHash
          )
        ).toBe(false);
      });

      it('should return false when citizenshipApplications registered account dont match with validation hash', async () => {
        const { isHashMatchWithCitizenshipApplicationHash } = useContract();

        const nonMatchingApplicationHash = '9a336ae86908b51fb4a3e243af80709';

        expect(
          await isHashMatchWithCitizenshipApplicationHash(
            mockAccountKey,
            nonMatchingApplicationHash
          )
        ).toBe(false);
      });
    });
  });

  describe('elections', () => {
    describe('applyForElectionsAsCandidate', () => {
      it('should call applyForElections contract function', async () => {
        const { applyForElectionsAsCandidate } = useContract();

        await applyForElectionsAsCandidate(MOCK_REGISTER_AS_CANDIDATE_FEE);
        expect(mockContract.applyForElections).toHaveBeenCalled();
      });
    });

    describe('closeElection', () => {
      it('should call closeElection contract function', async () => {
        const { closeElections } = useContract();

        await closeElections();
        expect(mockContract.closeElections).toHaveBeenCalled();
      });
    });

    describe('isAccountAlreadyVoted', () => {
      it('should call electionVotes and return true when account already voted', async () => {
        mockContract.electionVotes.mockImplementationOnce(
          () => Promise.resolve(mockAccountKey)
        );

        const { isAccountAlreadyVoted } = useContract();

        expect(await isAccountAlreadyVoted()).toBe(true);
        expect(mockContract.electionVotes).toHaveBeenCalled();
      });

      it('should call return false when not voted', async () => {
        const { isAccountAlreadyVoted } = useContract();

        expect(await isAccountAlreadyVoted()).toBe(false);
        expect(mockContract.electionVotes).toHaveBeenCalled();
      });
    });

    describe('isCandidateAlreadyApplied', () => {
      it('should call electionCandidateScores and return false when account not applied as candidate', async () => {
        const { isCandidateAlreadyApplied } = useContract();

        expect(await isCandidateAlreadyApplied(MOCK_NON_EXISTING_ADDRESS)).toBe(false);
        expect(mockContract.electionCandidateScores).toHaveBeenCalledWith(
          MOCK_NON_EXISTING_ADDRESS
        );
      });

      it('should call electionCandidateScores and return false when account is applied as candidate', async () => {
        const { isCandidateAlreadyApplied } = useContract();

        expect(await isCandidateAlreadyApplied(mockAccountKey)).toBe(true);
        expect(mockContract.electionCandidateScores).toHaveBeenCalledWith(
          mockAccountKey
        );
      });
    });

    describe('isThereOngoingElections', () => {
      it('should return false when electionsStartDate value is 0', async () => {
        mockContract.electionsStartDate.mockImplementationOnce(
          () => Promise.resolve(BigInt(0))
        );

        const { isThereOngoingElections } = useContract();

        expect(await isThereOngoingElections()).toBe(false);
        expect(mockContract.electionsStartDate).toHaveBeenCalled();
      });

      it('should return true when electionsStartDate is not 0', async () => {
        mockContract.electionsStartDate.mockImplementationOnce(
          () => Promise.resolve(BigInt(mockFutureTimestamp))
        );

        const { isThereOngoingElections } = useContract();

        expect(await isThereOngoingElections()).toBe(true);
      });
    });

    describe('scheduleNextElections', () => {
      it('should call scheduleNextElections with proper values', async () => {
        const { scheduleNextElections } = useContract();

        const electionDates = {
          startDate: mockFutureTimestamp,
          endDate: mockFutureTimestamp + TimeQuantities.MONTH
        };

        await scheduleNextElections(
          electionDates.startDate,
          electionDates.endDate
        );

        expect(mockContract.scheduleNextElections).toHaveBeenCalledWith(
          BigInt(electionDates.startDate),
          BigInt(electionDates.endDate)
        );
      });
    });

    describe('voteOnElectionsCandidate', () => {
      it('should call voteOnElections with proper values', async () => {
        const { voteOnElectionsCandidate } = useContract();

        await voteOnElectionsCandidate(mockAccountKey);

        expect(mockContract.voteOnElections).toHaveBeenCalledWith(mockAccountKey);
      });
    });

    describe('getElectionCandidateApplicationFee', () => {
      it('should call electionsCandidateApplicationFee and return application fee', async () => {
        const { getElectionCandidateApplicationFee } = useContract();

        expect(await getElectionCandidateApplicationFee()).toBe(MOCK_REGISTER_AS_CANDIDATE_FEE);
        expect(mockContract.electionsCandidateApplicationFee).toHaveBeenCalled();
      });
    });

    describe('getElectionsCandidatePublicKeyAtIndex', () => {
      it('should call electionCandidates with provided index and return candidate public key when there is an registered candidate at the index', async () => {
        const { getElectionsCandidatePublicKeyAtIndex } = useContract();

        expect(await getElectionsCandidatePublicKeyAtIndex(1)).toBe(mockAccountKey);
        expect(mockContract.electionCandidates).toHaveBeenCalledWith(BigInt(1));
      });

      it('should return empty address like public key when there is no registered candidate at the index', async () => {
        const { getElectionsCandidatePublicKeyAtIndex } = useContract();

        expect(await getElectionsCandidatePublicKeyAtIndex(2)).toBe(MOCK_NON_EXISTING_ADDRESS);
        expect(mockContract.electionCandidates).toHaveBeenCalledWith(BigInt(2));
      });
    });

    describe('getElectionCandidateScore', () => {
      it('should call electionCandidateScores with provided address and return candidate score', async () => {
        const { getElectionCandidateScore } = useContract();

        expect(await getElectionCandidateScore(mockAccountKey)).toBe(1);
        expect(mockContract.electionCandidateScores).toHaveBeenCalledWith(mockAccountKey);
      });

      it('should return zero score if candidate not exists in the contract', async () => {
        const { getElectionCandidateScore } = useContract();

        expect(await getElectionCandidateScore(mockNotRegisteredAccountKey)).toBe(0);
      });
    });

    describe('getNumberOfElectionCandidates', () => {
      it('should call getElectionCandidatesSize and return the number of candidates', async () => {
        const { getNumberOfElectionCandidates } = useContract();

        mockContract.getElectionCandidatesSize.mockImplementationOnce(() => Promise.resolve(4));

        expect(await getNumberOfElectionCandidates()).toBe(4);
        expect(mockContract.getElectionCandidatesSize).toHaveBeenCalled();
      });
    });
  });

  describe('getters', () => {
    describe('getCitizenAtIndex', () => {
      it('should call citizens and return public key', async () => {
        const { getCitizenAtIndex } = useContract();

        expect(await getCitizenAtIndex(0)).toBe(mockAccountKey);
        expect(mockContract.citizens).toHaveBeenCalled();
      });
    });

    describe('getCitizenRoleApplicationFee', () => {
      it('should call citizenRoleApplicationFee and return application fee', async () => {
        const { getCitizenRoleApplicationFee } = useContract();

        expect(await getCitizenRoleApplicationFee()).toBe(MOCK_CITIZENSHIP_APPLICATION_FEE);
        expect(mockContract.scheduleNextElections).toHaveBeenCalled();
      });
    });

    describe('getElectionStartEndIntervalInDays', () => {
      it('should call ELECTION_START_END_INTERVAL and get day format', async () => {
        const { getElectionStartEndIntervalInDays } = useContract();

        expect(await getElectionStartEndIntervalInDays()).toBe(
          TimeQuantities.MONTH / TimeQuantities.DAY
        );
        expect(mockContract.ELECTION_START_END_INTERVAL).toHaveBeenCalled();
      });
    });

    describe('getElectionsStartDate', () => {
      it('should call electionsStartDate and return election start date value', async () => {
        mockContract.electionsStartDate.mockImplementationOnce(
          () => Promise.resolve(BigInt(mockFutureTimestamp))
        );

        const { getElectionsStartDate } = useContract();

        expect(await getElectionsStartDate()).toBe(mockFutureTimestamp * 1000);
        expect(mockContract.electionsStartDate).toHaveBeenCalled();
      });
    });

    describe('getElectionsEndDate', () => {
      it('should call electionsEndDate and return election end date value', async () => {
        mockContract.electionsEndDate.mockImplementationOnce(
          () => Promise.resolve(BigInt(mockFutureTimestamp))
        );

        const { getElectionsEndDate } = useContract();

        expect(await getElectionsEndDate()).toBe(mockFutureTimestamp * 1000);
        expect(mockContract.electionsEndDate).toHaveBeenCalled();
      });
    });

    describe('getNumberOfCitizens', () => {
      it('should call getCitizensSize and return number of accounts', async () => {
        const { getNumberOfCitizens } = useContract();

        expect(await getNumberOfCitizens()).toBe(3);
        expect(mockContract.getCitizensSize).toHaveBeenCalled();
      });
    });

    describe('getNumberOfPoliticalActors', () => {
      it('should call politicalActorsSize and return number of accounts', async () => {
        const { getNumberOfPoliticalActors } = useContract();

        expect(await getNumberOfPoliticalActors()).toBe(3);
        expect(mockContract.getPoliticalActorsSize).toHaveBeenCalled();
      });
    });

    describe('getPoliticalActorAtIndex', () => {
      it('should call politicalActors and return public key', async () => {
        const { getPoliticalActorAtIndex } = useContract();

        expect(await getPoliticalActorAtIndex(0)).toBe(mockAccountKey);
        expect(mockContract.politicalActors).toHaveBeenCalled();
      });
    });

    describe('getVotedOnCandidatePublicKey', () => {
      it('should call electionVotes and return the candidate address', async () => {
        mockContract.electionVotes.mockImplementationOnce(
          () => Promise.resolve(mockAccountKey)
        );

        const { getVotedOnCandidatePublicKey } = useContract();

        expect(await getVotedOnCandidatePublicKey()).toBe(mockAccountKey);
        expect(mockContract.electionVotes).toHaveBeenCalled();
      });
    });
  });
});
