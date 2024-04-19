import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import React, { useEffect, useState } from 'react';

import { formatContractDateTime } from '@global/helpers/date';
import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Box, Button, CircularProgress, List, ListItem, Stack, Typography
} from '@mui/material';

type ElectionsInfo = {
  electionsStartDate?: number,
  electionsEndDate?: number
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
    getElectionCandidateScore
  } = useContract();
  const [electionInfo, setElectionInfo] = useState<ElectionsInfo>({});
  const [candidatesData, setCandidatesData] = useState<Candidate[] | undefined>();
  const [loading, setLoading] = useState(false);

  const { electionsStartDate, electionsEndDate } = electionInfo;

  useEffect(() => {
    const callElectionsStarsEndDate = async () => {
      const eStartDate = await asyncErrWrapper(getElectionsStartDate)();
      const eEndDate = await asyncErrWrapper(getElectionsEndDate)();

      if (eStartDate && eEndDate) {
        setElectionInfo({
          electionsStartDate: eStartDate,
          electionsEndDate: eEndDate
        });
      }
    };

    callElectionsStarsEndDate();
  }, []);

  const handleShowCandidates = async () => {
    setLoading(true);
    const numCandidates = await asyncErrWrapper(getNumberOfElectionCandidates)() || 0;

    const candidates = [];
    let totalVotes = 0;
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

      totalVotes += candidateScore;

      candidates.push({
        publicKey: candidatePublicKey,
        score: candidateScore
      });
    }

    // calculate percentage prop
    const candidatesWithPercentage = candidates.map((candidate) => (
      { ...candidate, percentage: ((candidate.score / totalVotes) * 1000) / 10 }
    ));

    setCandidatesData(candidatesWithPercentage);

    setLoading(false);
  };

  return (
    <PageContainer>
      <PageTitle>
        Ongoing & next elections
      </PageTitle>
      <Box sx={{ p: 2 }}>
        {electionsStartDate && electionsEndDate ? (
          <Stack spacing={2}>
            <Typography>Elections start: {formatContractDateTime(electionsStartDate)}</Typography>
            <Typography>Elections end: {formatContractDateTime(electionsEndDate)}</Typography>
            <Button onClick={handleShowCandidates} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Show Number of Candidates'}
            </Button>
            {candidatesData
            && <Typography>Number of candidates: {candidatesData.length}</Typography>}
            {candidatesData && candidatesData.length > 0 && (
              <List>
                {candidatesData.map((candidate) => (
                  <ListItem key={candidate.publicKey}>
                    {candidate.publicKey} | Votes: {candidate.score} | {candidate.percentage} %
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        ) : (
          <Alert severity="info">There is no ongoing or upcoming elections.</Alert>
        )}
      </Box>
    </PageContainer>
  );
};

export default OngoingScheduledElectionsPage;
