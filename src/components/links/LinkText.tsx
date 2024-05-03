import styled from '@emotion/styled';
import { Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LinkText = ({
  navigateTo,
  children
}: {
  navigateTo: string;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  const StyledLink = styled(Link)`
    font-family: 'Source Sans Pro';
    color: #663c00;
    padding: 4px 0;
    cursor: pointer;
  `;

  return (
    <StyledLink onClick={() => navigate(navigateTo)}>{children}</StyledLink>
  );
};

export default LinkText;
