import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import React, { useEffect, useState } from 'react';

import LabelText from '@components/general/LabelText/LabelText';
import { formatContractDateTime, getNow } from '@global/helpers/date';
import { compare2Address, isValidAddress } from '@global/helpers/validators';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Box, Button, List, ListItem, Stack, Typography
} from '@mui/material';
import { AddressLike } from 'ethers';

import LoadContent from '@components/general/Loaders/LoadContent';
import { showSuccessToast } from '@components/toasts/Toasts';
import { to2DecimalFixed } from '@global/helpers/calculation';
import { useUserContext } from '@hooks/context/userContext/UserContext';
import HowToRegIcon from '@mui/icons-material/HowToReg';

type ElectionsInfo = {
  electionsStartDate?: number,
  electionsEndDate?: number,
  accountAlreadyVoted?: boolean,
  votedOnCandidatePublicKey?: AddressLike
};

type Candidate = {
  publicKey: AddressLike,
  score: number,
  percentage: number
};

type CanidateData = { publicKey: AddressLike, score: number };

const moveToTopIfPkeyMatch = (candidates: CanidateData[], pKeyMatch: AddressLike) => {
  candidates.forEach((cd, i) => {
    if (cd.publicKey === pKeyMatch) {
      candidates.splice(i, 1);
      candidates.unshift(cd);
    }
  });
};

const OngoingScheduledElectionsPage: React.FC = () => {
  const {
    getElectionsEndDate,
    getElectionsStartDate,
    getNumberOfElectionCandidates,
    getElectionsCandidatePublicKeyAtIndex,
    getElectionCandidateScore,
    getVotedOnCandidatePublicKey,
    voteOnElectionsCandidate
  } = useContract();
  const { userState } = useUserContext();
  const [electionInfo, setElectionInfo] = useState<ElectionsInfo>({});
  const [candidatesData, setCandidatesData] = useState<Candidate[] | undefined>();

  const {
    electionsStartDate, electionsEndDate, accountAlreadyVoted, votedOnCandidatePublicKey
  } = electionInfo;

  const now = getNow();

  const callGetElectionsState = async () => {
    const eStartDate = await asyncErrWrapper(getElectionsStartDate)();
    const eEndDate = await asyncErrWrapper(getElectionsEndDate)();
    const _votedOnCandidatePublicKey = await asyncErrWrapper(getVotedOnCandidatePublicKey)() || '';

    const _accountAlreadyVoted = isValidAddress(_votedOnCandidatePublicKey);

    setElectionInfo({
      electionsStartDate: eStartDate,
      electionsEndDate: eEndDate,
      votedOnCandidatePublicKey: _votedOnCandidatePublicKey,
      accountAlreadyVoted: _accountAlreadyVoted
    });

    const numCandidates = await asyncErrWrapper(getNumberOfElectionCandidates)() || 0;

    const candidates: CanidateData[] = [];
    let totalScore = 0;
    for (let i = 0; i < numCandidates; i++) {
      // eslint-disable-next-line no-await-in-loop
      const candidatePublicKey = await asyncErrWrapper(
        getElectionsCandidatePublicKeyAtIndex
      )(i) as AddressLike;

      if (!candidatePublicKey) {
        continue;
      }
      // eslint-disable-next-line no-await-in-loop
      const candidateScore = await asyncErrWrapper(getElectionCandidateScore)(candidatePublicKey);

      if (!candidateScore) {
        continue;
      }

      totalScore += candidateScore;

      candidates.push({
        publicKey: candidatePublicKey,
        score: candidateScore
      });
    }

    // calculate percentage prop
    moveToTopIfPkeyMatch(candidates, _votedOnCandidatePublicKey);

    const candidatesWithPercentage = candidates.map((candidate) => (
      { ...candidate, percentage: to2DecimalFixed(candidate.score / totalScore) }
    ));

    setCandidatesData(candidatesWithPercentage);
  };

  useEffect(() => {
    callGetElectionsState();
  }, []);

  const voteOnCandidateClick = async (candidatePublicKey: AddressLike) => {
    await asyncErrWrapper(voteOnElectionsCandidate)(candidatePublicKey).then(() => {
      showSuccessToast(`You successfully voted on candidate ${candidatePublicKey}`);
      setElectionInfo({
        ...electionInfo,
        votedOnCandidatePublicKey: candidatePublicKey,
        accountAlreadyVoted: true
      });
      const updatedCandidateIndex = candidatesData?.findIndex(
        (candidate) => candidate.publicKey === candidatePublicKey
      ) || 0;
      const f_candidates = [...(candidatesData || [])];
      f_candidates[updatedCandidateIndex].score += 1;
      const totalScore = f_candidates.reduce(
        (accumulator, candidate) => accumulator + candidate.score,
        0
      );

      setCandidatesData(f_candidates.map((candidate) => ({
        ...candidate,
        percentage: to2DecimalFixed(candidate.score / totalScore)
      })));
    });
  };

  const electionsInfoIsLoading = electionsStartDate === undefined;
  const candidatesDataIsLoading = candidatesData === undefined;
  const thereIsUpcomingOrNotYetClosedElections = electionsStartDate && electionsEndDate;

  const votingIsEnabled = !accountAlreadyVoted
  && electionsStartDate && electionsStartDate < now
  && electionsEndDate && electionsEndDate > now;

  return (
    <PageContainer>
      <PageTitle>
        Ongoing & next elections
      </PageTitle>
      <Box sx={{ p: 2 }}>
        <LoadContent condition={electionsInfoIsLoading}>
          {thereIsUpcomingOrNotYetClosedElections ? (
            <Stack spacing={2}>
              <Stack spacing={2} direction="row">
                <LabelText label="Elections start:" text={formatContractDateTime(electionsStartDate)} />
                <LabelText label="Elections end:" text={formatContractDateTime(electionsEndDate)} />
              </Stack>
              <LoadContent condition={candidatesDataIsLoading}>
                {candidatesData && candidatesData.length > 0 ? (
                  <Stack spacing={2}>
                    <LabelText label="Number of candidates:" text={candidatesData.length} />
                    <List>
                      {candidatesData.map((candidate, index) => (
                        <ListItem sx={{ border: '1px solid #cb8b8b', mb: '10px' }} key={candidate.publicKey as string}>
                          <Stack spacing={1} sx={{ width: '100%' }}>
                            <Stack direction="row">
                              <Typography variant="h6">{`${index + 1}.`}</Typography>
                              {candidate.publicKey === votedOnCandidatePublicKey
                                ? (
                                  <Stack direction="row" sx={{ ml: 'auto' }}>
                                    <Typography sx={{ color: 'green' }}>You voted on this candidate</Typography>
                                    <HowToRegIcon color="success" />
                                  </Stack>
                                )
                                : (
                                  <Button
                                    disabled={
                                      !votingIsEnabled
                                      || compare2Address(
                                        candidate.publicKey,
                                        userState.walletAddress
                                      )
                                    }
                                    onClick={() => { voteOnCandidateClick(candidate.publicKey); }}
                                    variant="contained"
                                    sx={{ ml: 'auto' }}
                                  >
                                    Vote on candidate
                                  </Button>
                                )}
                            </Stack>
                            <LabelText label="Public Key:" text={candidate.publicKey as string} />
                            <LabelText label="Votes score:" text={candidate.score} />
                            <LabelText label="Votes (%):" text={candidate.percentage} />
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  </Stack>
                ) : <Typography>No candidate registered yet</Typography>}
              </LoadContent>
            </Stack>
          ) : (
            <Alert severity="info">There is no ongoing or upcoming elections.</Alert>
          )}
        </LoadContent>
      </Box>
    </PageContainer>
  );
};

export default OngoingScheduledElectionsPage;
