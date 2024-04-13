import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import React, { useState } from 'react';

import {
  Alert, Box, Button, CircularProgress, List, ListItem, Stack, Typography
} from '@mui/material';

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
const OngoingScheduledElectionsPage: React.FC = () => {
  const [electionStartDate, setElectionStartDate] = useState('April 5, 2024');
  const [electionEndDate, setElectionEndDate] = useState('April 12, 2024');
  const [numberOfCandidates, setNumberOfCandidates] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

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
        Ongoing Elections Page
      </PageTitle>
      <Box sx={{ p: 2 }}>
        {electionStartDate && electionEndDate ? (
          <Stack spacing={2}>
            <Typography>Elections start: {electionStartDate}</Typography>
            <Typography>Elections close: {electionEndDate}</Typography>
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
