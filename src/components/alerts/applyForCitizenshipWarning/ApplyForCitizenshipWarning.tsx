import LinkInText from '@components/links/LinkInText';
import { Alert } from '@mui/material';

const ApplyForCitizenshipWarning = () => (
  <Alert
    sx={{ margin: '10px auto' }}
    severity="warning"
    action={(
      <LinkInText navigateTo="community/apply-for-citizenship">
        Apply for citizenship
      </LinkInText>
      )}
  >
    You need citizenship to be part of the community!
  </Alert>
);

export default ApplyForCitizenshipWarning;
