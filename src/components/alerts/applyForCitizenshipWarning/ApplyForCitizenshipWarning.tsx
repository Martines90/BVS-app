import LinkInText from '@components/links/LinkInText';
import { Alert } from '@mui/material';

const ApplyForCitizenshipWarning = () => (
  <Alert
    sx={{ margin: '10px auto' }}
    severity="warning"
    action={(
      <LinkInText navigateTo="citizens/apply-for-citizenship">
        Apply for citizenship
      </LinkInText>
      )}
  >
    You need cizizenship to be part of the community!
  </Alert>
);

export default ApplyForCitizenshipWarning;
