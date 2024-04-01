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
    <Breadcrumbs maxItems={2} separator='>' aria-label='breadcrumb'>
      {pathnames.map(({ pathName, href }, index) => {
        return (
          <Link
            sx={{ cursor: 'pointer' }}
            key={index}
            underline='hover'
            color='inherit'
            onClick={() => handleClick(href || '/')}
          >
            {pathName}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default MainBreadcrumbs;
