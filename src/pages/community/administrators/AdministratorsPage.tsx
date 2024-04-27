import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import AdministratorsTable from '@components/tables/administratorsTable/AdministratorsTable';
import { Box } from '@mui/material';

const AdministratorsPage = () => (
  <PageContainer>
    <PageTitle>
      Administrators
    </PageTitle>
    <Box sx={{ p: 2 }}>
      <AdministratorsTable />
    </Box>
  </PageContainer>
);

export default AdministratorsPage;
