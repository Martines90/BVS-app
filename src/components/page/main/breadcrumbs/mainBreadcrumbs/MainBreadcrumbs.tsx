import { Button } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBreadcrumbMapFromUrl } from '../helpers';

const MainBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (href: string) => {
    navigate(href);
  };

  const pathnames = getBreadcrumbMapFromUrl(location);

  return (
    <Breadcrumbs maxItems={2} separator=">" aria-label="breadcrumb">
      {pathnames.map(({ pathName, href }) => (
        <Button
          component={Link}
          sx={{ cursor: 'pointer' }}
          key={`${pathName}-link`}
          underline="hover"
          color="inherit"
          onClick={() => handleClick(href || '/')}
        >
          {pathName}
        </Button>
      ))}
    </Breadcrumbs>
  );
};

export default MainBreadcrumbs;
