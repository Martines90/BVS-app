/* eslint-disable max-lines */
import { EMPTY_BYTES_32 } from '@global/constants/blockchain';
import { TimeQuantities } from '@global/constants/general';
import { toKeccak256HashToBytes32 } from '@global/helpers/hash-manipulation';
import { ContractRoleskeccak256, USER_ROLES } from '@global/types/user';
import {
  MOCK_CITIZENSHIP_APPLICATION_FEE,
  MOCK_NON_EXISTING_ADDRESS,
  MOCK_REGISTER_AS_CANDIDATE_FEE
} from '@mocks/contract-mocks';
import {
  AddressLike, BigNumberish, BytesLike
} from 'ethers';
import { ProConArticle, Voting } from './types';
import useContract from './useContract';

const mockFutureTimestamp = 2533566483;
const mockAccountKey = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
const mockNotRegisteredAccountKey = '0x914a73ad0b138eedf80704f9ccd81be56f33bbd5f8b371c82de3b6b6a5a23ff7';

const mockApplyForCitizenshipHash = toKeccak256HashToBytes32(
  `test@email.com${mockAccountKey}`
);

const mockVotingKeyHash = toKeccak256HashToBytes32(
  'jnksadjnsadkjskndeoio'
);

const mockArtickeKeyHash = toKeccak256HashToBytes32(
  'dsdfssfdamkibieijrpsp'
);

type ProConArticleData = [
  BytesLike,
  boolean,
  boolean,
  AddressLike,
  string,
  boolean,
  string,
  string,
  string
];

const mockProConArticlesData: ProConArticleData = [
  mockVotingKeyHash,
  false,
  false,
  mockAccountKey,
  'test-ipfs-hash',
  true,
  'test-ipfs-hash',
  'test-ipfs-hash',
  'test-ipfs-hash'
];

const mockProConArticles: ProConArticle[] = [
  {
    articleKey: mockArtickeKeyHash,
    votingKey: mockVotingKeyHash,
    isArticleApproved: false,
    isResponseApproved: false,
    publisher: mockAccountKey,
    articleIpfsHash: 'test-ipfs-hash',
    isVoteOnA: true,
    responseStatementIpfsHash: 'test-ipfs-hash',
    articleContentCheckQuizIpfsHash: 'test-ipfs-hash',
    responseContentCheckQuizIpfsHash: 'test-ipfs-hash'
  }
];

const mockCitizens: AddressLike[] = [
  mockAccountKey
];

type ContractVoting = [
  boolean,
  boolean,
  BytesLike,
  BigNumberish,
  BigNumberish,
  AddressLike,
  string,
  BigNumberish,
  BigNumberish,
  BigNumberish,
  string
];

const mockVoting: ContractVoting = [
  true,
  false,
  mockVotingKeyHash,
  BigInt(100),
  BigInt(44),
  mockAccountKey,
  'content-ipfs-hash',
  BigInt(mockFutureTimestamp),
  BigInt(12445),
  BigInt(23334),
  'content-ipfs-hash'
];

const mockContract = {
  ELECTION_START_END_INTERVAL: jest.fn(() => Promise.resolve(BigInt(TimeQuantities.MONTH))),
  addKeccak256HashedAnswersToVotingContent: jest.fn(() => Promise.resolve()),
  approveVoting: jest.fn(() => Promise.resolve()),
  addKeccak256HashedAnswersToArticle: jest.fn(() => Promise.resolve()),
  addKeccak256HashedAnswersToArticleResponse: jest.fn(() => Promise.resolve()),
  assignQuizIpfsHashToVoting: jest.fn(() => Promise.resolve()),
  assignQuizIpfsHashToArticleOrResponse: jest.fn(() => Promise.resolve()),
  applyForCitizenshipRole: jest.fn(() => Promise.resolve()),
  applyForElections: jest.fn(() => Promise.resolve()),
  articleKeys: jest.fn(() => Promise.resolve(mockArtickeKeyHash)),
  APPROVE_VOTING_BEFORE_IT_STARTS_LIMIT: jest.fn(() => Promise.resolve(TimeQuantities.DAY * 3)),
  closeElections: jest.fn(() => Promise.resolve()),
  citizens: jest.fn((index) => Promise.resolve(mockCitizens[index])),
  completeContentReadQuiz: jest.fn(() => Promise.resolve()),
  admins: jest.fn((index) => Promise.resolve(mockCitizens[index])),
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
  firstVotingCycleStartDate: jest.fn(() => Promise.resolve(mockFutureTimestamp)),
  grantCitizenRole: jest.fn(() => Promise.resolve()),
  hasRole: jest.fn(() => Promise.resolve(true)),
  MIN_TOTAL_CONTENT_READ_CHECK_ANSWER: jest.fn(() => Promise.resolve(50)),
  getAccountVotingQuizAnswerIndexes: jest.fn(() => Promise.resolve([3, 4, 17, 33, 19])),
  getAccountArticleQuizAnswerIndexes: jest.fn(() => Promise.resolve([5, 9, 22, 11, 1])),
  getAccountArticleResponseQuizAnswerIndexes: jest.fn(() => Promise.resolve([20, 5, 13, 2, 8])),
  getAdminsSize: jest.fn(() => Promise.resolve(1)),
  getApproveVotingMinTimeAfterLimit: jest.fn(() => Promise.resolve(TimeQuantities.DAY * 3 * 1000)),
  getArticleKeysLength: jest.fn(() => Promise.resolve(1)),
  getCitizensSize: jest.fn(() => Promise.resolve(3)),
  getElectionCandidatesSize: jest.fn(() => Promise.resolve(0)),
  getVotingKeysLength: jest.fn(() => Promise.resolve(10)),
  citizenshipApplications: jest.fn((publicKey) => {
    if (publicKey === mockAccountKey) {
      return Promise.resolve(mockApplyForCitizenshipHash);
    }
    return Promise.resolve(MOCK_NON_EXISTING_ADDRESS);
  }),
  calculateVoteScore: jest.fn(() => Promise.resolve(BigInt(133))),
  electionsStartDate: jest.fn(() => Promise.resolve(BigInt(0))),
  electionsEndDate: jest.fn(() => Promise.resolve(BigInt(0))),
  getPoliticalActorsSize: jest.fn(() => Promise.resolve(BigInt(3))),
  scheduleNextElections: jest.fn(() => Promise.resolve()),
  scheduleNewVoting: jest.fn(() => Promise.resolve()),
  setFirstVotingCycleStartDate: jest.fn(() => Promise.resolve()),
  politicalActors: jest.fn((index) => Promise.resolve(mockCitizens[index])),
  politicalActorVotingCredits: jest.fn(() => Promise.resolve(3)),
  publishArticleToVotingsCount: jest.fn(() => Promise.resolve(3)),
  publishProConArticle: jest.fn(() => Promise.resolve()),
  publishProConArticleResponse: jest.fn(() => Promise.resolve()),
  proConArticles: jest.fn(() => Promise.resolve(mockProConArticlesData)),
  voteOnElections: jest.fn(() => Promise.resolve()),
  votingCycleStartVoteCount: jest.fn(() => Promise.resolve(3)),
  votings: jest.fn(() => mockVoting),
  votingContentReadCheckAnswers: jest.fn(() => 'answer-hash-string'),
  votingKeys: jest.fn(() => mockVotingKeyHash),
  voteOnVoting: jest.fn(() => Promise.resolve()),
  VOTING_DURATION: jest.fn(() => Promise.resolve(14 * TimeQuantities.DAY)),
  VOTING_CYCLE_INTERVAL: jest.fn(() => Promise.resolve(3)),
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

  describe('votings', () => {
    describe('approveVoting', () => {
      it('should call approveVoting contract function', async () => {
        const { approveVoting } = useContract();

        await approveVoting(mockVotingKeyHash);
        expect(mockContract.approveVoting).toHaveBeenCalledWith(mockVotingKeyHash);
      });
    });

    describe('completeVotingContentCheckQuiz', () => {
      it('should call completeContentReadQuiz contract function', async () => {
        const { completeVotingContentCheckQuiz } = useContract();

        await completeVotingContentCheckQuiz(mockVotingKeyHash, ['answer-1-hash', 'answer-2-hash']);

        expect(mockContract.completeContentReadQuiz.mock.calls[mockContract.completeContentReadQuiz.mock.calls.length - 1]).toEqual([BigInt(1), mockVotingKeyHash, EMPTY_BYTES_32, ['answer-1-hash', 'answer-2-hash']]);
      });
    });

    describe('addAnswersToVotingContent', () => {
      it('should call addKeccak256HashedAnswersToVotingContent contract function', async () => {
        const { addAnswersToVotingContent } = useContract();

        await addAnswersToVotingContent(mockVotingKeyHash, ['answer-1-hash', 'answer-2-hash']);
        expect(mockContract.addKeccak256HashedAnswersToVotingContent).toHaveBeenCalledWith(mockVotingKeyHash, ['answer-1-hash', 'answer-2-hash']);
      });
    });

    describe('assignArticleToVoting', () => {
      it('should call publishProConArticle contract function', async () => {
        const { assignArticleToVoting } = useContract();

        await assignArticleToVoting(mockVotingKeyHash, 'test-ipfs-hash', true);
        expect(mockContract.publishProConArticle).toHaveBeenCalledWith(mockVotingKeyHash, 'test-ipfs-hash', true);
      });
    });

    describe('assignQuizIpfsHashToVoting', () => {
      it('should call assignQuizIpfsHashToVoting contract function', async () => {
        const { assignQuizIpfsHashToVoting } = useContract();

        await assignQuizIpfsHashToVoting(mockVotingKeyHash, 'test-ipfs-hash');
        expect(mockContract.assignQuizIpfsHashToVoting).toHaveBeenCalledWith(mockVotingKeyHash, 'test-ipfs-hash');
      });
    });

    describe('setFirstVotingCycleStartDate', () => {
      it('should call setFirstVotingCycleStartDate contract function', async () => {
        const { setFirstVotingCycleStartDate } = useContract();

        await setFirstVotingCycleStartDate(mockFutureTimestamp);
        expect(mockContract.setFirstVotingCycleStartDate).toHaveBeenCalled();
      });
    });

    describe('scheduleNewVoting', () => {
      it('should call scheduleNewVoting contract function', async () => {
        const { scheduleNewVoting } = useContract();

        await scheduleNewVoting('test-ipfs-hash', mockFutureTimestamp, 0);
        expect(mockContract.scheduleNewVoting).toHaveBeenCalledWith('test-ipfs-hash', mockFutureTimestamp, 0);
      });
    });

    describe('voteOnVoting', () => {
      it('should call voteOnVoting contract function', async () => {
        const { voteOnVoting } = useContract();

        await voteOnVoting(mockVotingKeyHash, true);
        expect(mockContract.voteOnVoting).toHaveBeenCalledWith(mockVotingKeyHash, true);
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
  });

  describe('articles', () => {
    describe('addAnswersToArticleContent', () => {
      it('should call addKeccak256HashedAnswersToArticle', async () => {
        const { addAnswersToArticleContent } = useContract();

        expect(await addAnswersToArticleContent(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          []
        ));
        expect(mockContract.addKeccak256HashedAnswersToArticle).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          []
        );
      });
    });

    describe('addAnswersToResponseContent', () => {
      it('should call addKeccak256HashedAnswersToArticleResponse', async () => {
        const { addAnswersToResponseContent } = useContract();

        expect(await addAnswersToResponseContent(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          []
        ));
        expect(mockContract.addKeccak256HashedAnswersToArticleResponse).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          []
        );
      });
    });

    describe('assignQuizIpfsHashToArticle', () => {
      it('should call assignQuizIpfsHashToArticleOrResponse', async () => {
        const { assignQuizIpfsHashToArticle } = useContract();

        expect(await assignQuizIpfsHashToArticle(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          'test-ipfs-hash'
        ));
        expect(mockContract.assignQuizIpfsHashToArticleOrResponse).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          'test-ipfs-hash',
          true
        );
      });
    });

    describe('assignQuizIpfsHashToResponse', () => {
      it('should call assignQuizIpfsHashToArticleOrResponse', async () => {
        const { assignQuizIpfsHashToResponse } = useContract();

        expect(await assignQuizIpfsHashToResponse(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          'test-ipfs-hash'
        ));
        expect(mockContract.assignQuizIpfsHashToArticleOrResponse).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          'test-ipfs-hash',
          false
        );
      });
    });

    describe('assignResponseIpfsHashToArticle', () => {
      it('should call publishProConArticleResponse', async () => {
        const { assignResponseIpfsHashToArticle } = useContract();

        expect(await assignResponseIpfsHashToArticle(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          'test-ipfs-hash'
        ));
        expect(mockContract.publishProConArticleResponse).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          'test-ipfs-hash'
        );
      });
    });

    describe('completeArticleContentCheckQuiz', () => {
      it('should call completeContentReadQuiz contract function', async () => {
        const { completeArticleContentCheckQuiz } = useContract();

        await completeArticleContentCheckQuiz(mockVotingKeyHash, mockArtickeKeyHash, ['answer-1-hash', 'answer-2-hash']);

        expect(
          mockContract.completeContentReadQuiz.mock.calls[
            mockContract.completeContentReadQuiz.mock.calls.length - 1]
        ).toEqual(
          [BigInt(2), mockVotingKeyHash, mockArtickeKeyHash, ['answer-1-hash', 'answer-2-hash']]
        );
      });
    });

    describe('completeArticleResponseContentCheckQuiz', () => {
      it('should call completeContentReadQuiz contract function', async () => {
        const { completeArticleResponseContentCheckQuiz } = useContract();

        await completeArticleResponseContentCheckQuiz(mockVotingKeyHash, mockArtickeKeyHash, ['answer-1-hash', 'answer-2-hash']);

        expect(
          mockContract.completeContentReadQuiz.mock.calls[
            mockContract.completeContentReadQuiz.mock.calls.length - 1]
        ).toEqual(
          [BigInt(3), mockVotingKeyHash, mockArtickeKeyHash, ['answer-1-hash', 'answer-2-hash']]
        );
      });
    });
  });

  describe('getters', () => {
    describe('getAccountVotingRelatedQuestionIndexes', () => {
      it('should call getAccountVotingQuizAnswerIndexes and return voting content related question indexes', async () => {
        const { getAccountVotingRelatedQuestionIndexes } = useContract();

        expect(
          await getAccountVotingRelatedQuestionIndexes(mockVotingKeyHash, mockAccountKey)
        ).toStrictEqual([3, 4, 17, 33, 19]);

        expect(mockContract.getAccountVotingQuizAnswerIndexes).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockAccountKey
        );
      });
    });

    describe('getAccountArticleRelatedQuestionIndexes', () => {
      it('should call getAccountArticleQuizAnswerIndexes and return article content related question indexes', async () => {
        const { getAccountArticleRelatedQuestionIndexes } = useContract();

        expect(
          await getAccountArticleRelatedQuestionIndexes(
            mockVotingKeyHash,
            mockArtickeKeyHash,
            mockAccountKey
          )
        ).toStrictEqual([5, 9, 22, 11, 1]);

        expect(mockContract.getAccountArticleQuizAnswerIndexes).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          mockAccountKey
        );
      });
    });

    describe('getAccountArticleResponseRelatedQuestionIndexes', () => {
      it('should call getAccountArticleResponseQuizAnswerIndexes and return response content related question indexes', async () => {
        const { getAccountArticleResponseRelatedQuestionIndexes } = useContract();

        expect(
          await getAccountArticleResponseRelatedQuestionIndexes(
            mockVotingKeyHash,
            mockArtickeKeyHash,
            mockAccountKey
          )
        ).toStrictEqual([20, 5, 13, 2, 8]);

        expect(mockContract.getAccountArticleResponseQuizAnswerIndexes).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockArtickeKeyHash,
          mockAccountKey
        );
      });
    });

    describe('getAccountVotingScore', () => {
      it('should call calculateVoteScore and return account voting related score', async () => {
        const { getAccountVotingScore } = useContract();

        expect(await getAccountVotingScore(mockVotingKeyHash, mockAccountKey)).toBe(133);
        expect(mockContract.calculateVoteScore).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockAccountKey
        );
      });
    });

    describe('getAdministratorAtIndex', () => {
      it('should call admins and return public key', async () => {
        const { getAdministratorAtIndex } = useContract();

        expect(await getAdministratorAtIndex(0)).toBe(mockAccountKey);
        expect(mockContract.admins).toHaveBeenCalledWith(0);
      });
    });

    describe('getApproveVotingMinTimeAfterLimit', () => {
      it('should call APPROVE_VOTING_BEFORE_IT_STARTS_LIMIT and return a number', async () => {
        const { getApproveVotingMinTimeAfterLimit } = useContract();

        expect(await getApproveVotingMinTimeAfterLimit()).toBe(TimeQuantities.DAY * 3 * 1000);
        expect(mockContract.APPROVE_VOTING_BEFORE_IT_STARTS_LIMIT).toHaveBeenCalled();
      });
    });

    describe('getArticleAtKey', () => {
      it('should call proConArticles and return article data', async () => {
        const { getArticleAtKey } = useContract();

        expect(await getArticleAtKey(
          mockVotingKeyHash,
          mockArtickeKeyHash
        )).toEqual(mockProConArticles[0]);

        expect(mockContract.proConArticles).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockArtickeKeyHash
        );
      });
    });

    describe('getCitizenAtIndex', () => {
      it('should call citizens and return public key', async () => {
        const { getCitizenAtIndex } = useContract();

        expect(await getCitizenAtIndex(0)).toBe(mockAccountKey);
        expect(mockContract.citizens).toHaveBeenCalledWith(0);
      });
    });

    describe('getFirstVotingCycleStartDate', () => {
      it('should call firstVotingCycleStartDate and return proper date', async () => {
        const { getFirstVotingCycleStartDate } = useContract();

        expect(await getFirstVotingCycleStartDate()).toBe(mockFutureTimestamp * 1000);
        expect(mockContract.firstVotingCycleStartDate).toHaveBeenCalled();
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

    describe('getMinTotalQuizCheckAnswers', () => {
      it('should call MIN_TOTAL_CONTENT_READ_CHECK_ANSWER and return a number', async () => {
        const { getMinTotalQuizCheckAnswers } = useContract();

        expect(await getMinTotalQuizCheckAnswers()).toBe(50);
        expect(mockContract.MIN_TOTAL_CONTENT_READ_CHECK_ANSWER).toHaveBeenCalled();
      });
    });

    describe('getNumberOfAdministrators', () => {
      it('should call getCitizensSize and return number of admin accounts', async () => {
        const { getNumberOfAdministrators } = useContract();

        expect(await getNumberOfAdministrators()).toBe(1);
        expect(mockContract.getAdminsSize).toHaveBeenCalled();
      });
    });

    describe('getNumberOfCitizens', () => {
      it('should call getCitizensSize and return number of accounts', async () => {
        const { getNumberOfCitizens } = useContract();

        expect(await getNumberOfCitizens()).toBe(3);
        expect(mockContract.getCitizensSize).toHaveBeenCalled();
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

    describe('getNumberOfPoliticalActors', () => {
      it('should call politicalActorsSize and return number of accounts', async () => {
        const { getNumberOfPoliticalActors } = useContract();

        expect(await getNumberOfPoliticalActors()).toBe(3);
        expect(mockContract.getPoliticalActorsSize).toHaveBeenCalled();
      });
    });

    describe('getNumberOfVotings', () => {
      it('should call getVotingKeysLength and return number of votings', async () => {
        const { getNumberOfVotings } = useContract();

        expect(await getNumberOfVotings()).toBe(10);
        expect(mockContract.getVotingKeysLength).toHaveBeenCalled();
      });
    });

    describe('getPoliticalActorAtIndex', () => {
      it('should call politicalActors and return public key', async () => {
        const { getPoliticalActorAtIndex } = useContract();

        expect(await getPoliticalActorAtIndex(0)).toBe(mockAccountKey);
        expect(mockContract.politicalActors).toHaveBeenCalled();
      });
    });

    describe('getPoliticalActorVotingCredits', () => {
      it('should call politicalActorVotingCredits and return number', async () => {
        const { getPoliticalActorVotingCredits } = useContract();

        expect(await getPoliticalActorVotingCredits(mockAccountKey)).toBe(3);
        expect(mockContract.politicalActorVotingCredits).toHaveBeenCalledWith(mockAccountKey);
      });
    });

    describe('getPoliticalActorPublishArticleToVotingsCount', () => {
      it('should call publishArticleToVotingsCount and return number', async () => {
        const { getPoliticalActorPublishArticleToVotingsCount } = useContract();

        expect(await getPoliticalActorPublishArticleToVotingsCount(
          mockAccountKey,
          mockVotingKeyHash
        )).toBe(3);
        expect(mockContract.publishArticleToVotingsCount).toHaveBeenCalledWith(
          mockAccountKey,
          mockVotingKeyHash
        );
      });
    });

    describe('getPoliticalActorVotingCycleVoteStartCount', () => {
      it('should call votingCycleStartVoteCount and return number', async () => {
        const { getPoliticalActorVotingCycleVoteStartCount } = useContract();

        expect(await getPoliticalActorVotingCycleVoteStartCount(mockAccountKey, 2)).toBe(3);
        expect(mockContract.votingCycleStartVoteCount).toHaveBeenCalledWith(2, mockAccountKey);
      });
    });

    describe('getVotingAssignedArticlesPublishedByAccount', () => {
      it('should call votingCycleStartVoteCount and return number', async () => {
        const { getVotingAssignedArticlesPublishedByAccount } = useContract();

        expect(await getVotingAssignedArticlesPublishedByAccount(
          mockVotingKeyHash,
          mockAccountKey
        )).toEqual(mockProConArticles);

        expect(mockContract.getArticleKeysLength).toHaveBeenCalled();
        expect(mockContract.articleKeys).toHaveBeenCalledWith(BigInt(0));
        expect(mockContract.proConArticles).toHaveBeenCalledWith(
          mockVotingKeyHash,
          mockArtickeKeyHash
        );
      });
    });

    describe('getVotingContentCheckAnswerAtIndex', () => {
      // FIXME: votingContentReadCheckAnswers has to be getVotingContentReadCheckAnswersLength
      it('should call votingContentReadCheckAnswers and return a string', async () => {
        const { getVotingContentCheckAnswerAtIndex } = useContract();

        expect(await getVotingContentCheckAnswerAtIndex(mockVotingKeyHash, 0)).toBe('answer-hash-string');
        expect(mockContract.votingContentReadCheckAnswers).toHaveBeenCalledWith(
          mockVotingKeyHash,
          BigInt(0)
        );
      });
    });

    describe('getVotingContentReadCheckAnswersLength', () => {
      // FIXME: votingContentReadCheckAnswers has to be getVotingContentReadCheckAnswersLength
      it('should call votingContentReadCheckAnswers and return a number', async () => {
        const { getVotingContentReadCheckAnswersLength } = useContract();

        expect(await getVotingContentReadCheckAnswersLength(mockVotingKeyHash)).toBe(50);
        expect(mockContract.votingContentReadCheckAnswers).toHaveBeenCalled();
      });
    });

    describe('getVotingDuration', () => {
      it('should call VOTING_DURATION and return a number', async () => {
        const { getVotingDuration } = useContract();

        expect(await getVotingDuration()).toBe(14 * TimeQuantities.DAY * 1000);
        expect(mockContract.VOTING_DURATION).toHaveBeenCalled();
      });
    });

    describe('getVotingAtKey', () => {
      it('should call votings and return a number', async () => {
        const { getVotingAtKey } = useContract();

        const mockExpectedVotingData: Voting = {
          approved: true,
          cancelled: false,
          key: mockVotingKeyHash,
          budget: 100,
          voteCount: 44,
          creator: mockAccountKey,
          contentIpfsHash: 'content-ipfs-hash',
          startDate: mockFutureTimestamp * 1000,
          voteOnAScore: 12445,
          voteOnBScore: 23334,
          votingContentCheckQuizIpfsHash: 'content-ipfs-hash'
        };

        expect(await getVotingAtKey(mockVotingKeyHash)).toEqual(mockExpectedVotingData);
        expect(mockContract.votings).toHaveBeenCalledWith(mockVotingKeyHash);
      });
    });

    describe('getVotingKeyAtIndex', () => {
      it('should call votingKeys and return a number', async () => {
        const { getVotingKeyAtIndex } = useContract();

        expect(await getVotingKeyAtIndex(1)).toBe(mockVotingKeyHash);
        expect(mockContract.votingKeys).toHaveBeenCalledWith(BigInt(1));
      });
    });

    describe('getVotingCycleInterval', () => {
      it('should call VOTING_CYCLE_INTERVAL and return a number', async () => {
        mockContract.VOTING_CYCLE_INTERVAL.mockImplementationOnce(
          () => Promise.resolve(3)
        );

        const { getVotingCycleInterval } = useContract();

        expect(await getVotingCycleInterval()).toBe(3000);
        expect(mockContract.VOTING_CYCLE_INTERVAL).toHaveBeenCalled();
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
