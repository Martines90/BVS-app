import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import React, { useEffect, useState } from 'react';

import LabelText from '@components/general/LabelText/LabelText';
import { formatContractDateTime, getNow } from '@global/helpers/date';
import { isValidAddress } from '@global/helpers/validators';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Box, Button, List, ListItem, Stack, Typography
} from '@mui/material';
import { AddressLike } from 'ethers';

import LoadContent from '@components/general/Loaders/LoadContent';
import HowToRegIcon from '@mui/icons-material/HowToReg';

type ElectionsInfo = {
  electionsStartDate?: number,
  electionsEndDate?: number,
  accountAlreadyVoted?: boolean,
  votedOnCandidatePublicKey?: AddressLike
};

type Candidate = {
  publicKey: string,
  score: number,
  percentage: number
};

const OngoingScheduledElectionsPage: React.FC = () => {
  const {
    getElectionsEndDate,
    getElectionsStartDate,
    getNumberOfElectionCandidates,
    getElectionsCandidatePublicKeyAtIndex,
    getElectionCandidateScore,
    getVotedOnCandidatePublicKey
  } = useContract();
  const [electionInfo, setElectionInfo] = useState<ElectionsInfo>({});
  const [candidatesData, setCandidatesData] = useState<Candidate[] | undefined>();

  const {
    electionsStartDate, electionsEndDate, accountAlreadyVoted, votedOnCandidatePublicKey
  } = electionInfo;

  const now = getNow();

  useEffect(() => {
    const callElectionsStarsEndDate = async () => {
      const eStartDate = await asyncErrWrapper(getElectionsStartDate)();
      const eEndDate = await asyncErrWrapper(getElectionsEndDate)();
      const _votedOnCandidatePublicKey = await asyncErrWrapper(getVotedOnCandidatePublicKey)();
      const _accountAlreadyVoted = isValidAddress(_votedOnCandidatePublicKey);

      if (eStartDate && eEndDate) {
        setElectionInfo({
          electionsStartDate: eStartDate,
          electionsEndDate: eEndDate,
          votedOnCandidatePublicKey: _votedOnCandidatePublicKey,
          accountAlreadyVoted: _accountAlreadyVoted
        });
      }
    };

    const callRenderCandidatesInfo = async () => {
      const numCandidates = await asyncErrWrapper(getNumberOfElectionCandidates)() || 0;

      const candidates = [];
      let totalScore = 0;
      for (let i = 0; i < numCandidates; i++) {
        // eslint-disable-next-line no-await-in-loop
        const candidatePublicKey = await asyncErrWrapper(
          getElectionsCandidatePublicKeyAtIndex
        )(i) as string;

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
      const candidatesWithPercentage = candidates.map((candidate) => (
        { ...candidate, percentage: ((candidate.score / totalScore) * 1000) / 10 }
      ));

      setCandidatesData(candidatesWithPercentage);
    };

    callElectionsStarsEndDate();
    callRenderCandidatesInfo();
  }, []);

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
                      {candidatesData.sort(
                        (a) => (a.publicKey === votedOnCandidatePublicKey ? 1 : 0)
                      ).map((candidate, index) => (
                        <ListItem sx={{ border: '1px solid #cb8b8b', mb: '10px' }} key={candidate.publicKey}>
                          <Stack spacing={1} sx={{ width: '100%' }}>
                            <Stack direction="row">
                              <Typography variant="h6">{`Candidate ${index + 1}`}</Typography>
                              {candidate.publicKey === votedOnCandidatePublicKey
                                ? (
                                  <Stack direction="row" sx={{ ml: 'auto' }}>
                                    <Typography sx={{ color: 'green' }}>You voted on this candidate</Typography>
                                    <HowToRegIcon color="success" />
                                  </Stack>
                                )
                                : (
                                  <Button disabled={!votingIsEnabled} variant="contained" sx={{ ml: 'auto' }}>
                                    Vote on candidate
                                  </Button>
                                )}
                            </Stack>
                            <LabelText label="Public Key:" text={candidate.publicKey} />
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
