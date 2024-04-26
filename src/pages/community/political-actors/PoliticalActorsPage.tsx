import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import PoliticalActorsTable from '@components/tables/politicalActorsTable/PoliticalActorsTable';
import { Box } from '@mui/material';

const PoliticalActorsPage = () => (
  <PageContainer>
    <PageTitle>
      Political actors
    </PageTitle>
    <Box sx={{ p: 2 }}>
      <PoliticalActorsTable />
    </Box>
  </PageContainer>
);

export default PoliticalActorsPage;
