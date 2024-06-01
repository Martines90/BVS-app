import PageContainer from '@components/pages/components/PageContainer';
import PageTitle from '@components/pages/components/PageTitle';
import ConstantsTable from '@components/tables/constantsTable/ConstantsTable';
import { Box } from '@mui/material';

const ConstantsPage = () => (
  <PageContainer>
    <PageTitle>
      Constants
    </PageTitle>
    <Box sx={{ p: 2 }}>
      <ConstantsTable />
    </Box>
  </PageContainer>
);

export default ConstantsPage;
