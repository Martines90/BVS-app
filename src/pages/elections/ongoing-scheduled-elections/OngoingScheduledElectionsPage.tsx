import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import React, { useEffect, useState } from 'react';

import useContract from '@hooks/contract/useContract';
import asyncErrWrapper from '@hooks/error-success/asyncErrWrapper';
import {
  Alert, Box, Button, CircularProgress, List, ListItem, Stack, Typography
} from '@mui/material';
import dayjs from 'dayjs';

// Placeholder for blockchain interaction
const getNumberOfCandidates = async () => new Promise(
  (resolve) => {
    setTimeout(() => resolve(5), 2000);
  }
);
const getCandidates = async () => new Promise((resolve) => {
  setTimeout(() => resolve([
    { name: 'Candidate A', votes: 120, percentage: '30%' },
    { name: 'Candidate B', votes: 90, percentage: '22.5%' },
    { name: 'Candidate C', votes: 150, percentage: '37.5%' }
  ]), 2000);
});

type ElectionsInfo = {
  electionsStartDate?: number,
  electionsEndDate?: number
};

const OngoingScheduledElectionsPage: React.FC = () => {
  const { getElectionsEndDate, getElectionsStartDate } = useContract();
  const [electionInfo, setElectionInfo] = useState<ElectionsInfo>({});
  const [numberOfCandidates, setNumberOfCandidates] = useState(null);
  const [candidates, setCandidates] = useState([]);
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
    const numCandidates = await getNumberOfCandidates();
    setNumberOfCandidates(numCandidates);
    const candidateData = await getCandidates();
    setCandidates(candidateData);
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
            <Typography>Elections start: {dayjs(electionsStartDate).format('DD/MM/YYYY')}</Typography>
            <Typography>Elections close: {dayjs(electionsEndDate).format('DD/MM/YYYY')}</Typography>
            <Button onClick={handleShowCandidates} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Show Number of Candidates'}
            </Button>
            {numberOfCandidates !== null
            && <Typography>Number of candidates: {numberOfCandidates}</Typography>}
            {candidates.length > 0 && (
              <List>
                {candidates.map((candidate, index) => (
                  <ListItem key={index}>
                    {candidate.name} | Votes: {candidate.votes} | {candidate.percentage}
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
