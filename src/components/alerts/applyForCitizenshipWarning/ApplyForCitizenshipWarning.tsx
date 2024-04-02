import styled from '@emotion/styled';
import { Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ApplyForCitizenshipWarning = () => {
  const navigate = useNavigate();

  const StyledLink = styled(Link)`
    font-family: 'Source Sans Pro';
    color: #663c00;
    padding: 4px 0;
    cursor: pointer;
  `;

  return (
    <Alert
      sx={{ margin: '10px auto' }}
      severity='warning'
      action={
        <StyledLink onClick={() => navigate('citizens/apply-for-citizenship')}>
          Apply for citizenship
        </StyledLink>
      }
    >
      You need cizizenship to be part of the community!
    </Alert>
  );
};

export default ApplyForCitizenshipWarning;
