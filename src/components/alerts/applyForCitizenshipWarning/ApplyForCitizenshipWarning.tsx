import LinkText from '@components/links/LinkText';
import { Alert } from '@mui/material';

const ApplyForCitizenshipWarning = () => (
  <Alert
    sx={{ margin: '10px auto' }}
    severity="warning"
    action={(
      <LinkText navigateTo="community/apply-for-citizenship">
        Apply for citizenship
      </LinkText>
      )}
  >
    You need citizenship to be part of the community!
  </Alert>
);

export default ApplyForCitizenshipWarning;
