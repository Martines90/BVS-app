import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import CitizensTable from '@components/tables/citizensTable/CitizensTable';
import { Box } from '@mui/material';

const CitizensPage = () => (
  <PageContainer>
    <PageTitle>
      Citizens
    </PageTitle>
    <Box sx={{ p: 2 }}>
      <CitizensTable />
    </Box>
  </PageContainer>
);

export default CitizensPage;
