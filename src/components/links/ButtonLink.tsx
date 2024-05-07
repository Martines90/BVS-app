import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ButtonLink = ({
  navigateTo,
  children
}: {
  navigateTo: string;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  return (
    <Button variant="contained" onClick={() => navigate(navigateTo)}>{children}</Button>
  );
};

export default ButtonLink;
