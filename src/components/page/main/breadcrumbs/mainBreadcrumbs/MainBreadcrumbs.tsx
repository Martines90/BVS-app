import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useLocation, useNavigate } from 'react-router-dom';

type PathChunk = {
  pathName: string;
  isHash: boolean;
  href?: string;
};

const MainBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let href = '';

  const pathnames: PathChunk[] = [
    ...location.pathname
      .split('/')
      .filter((x) => x)
      .map((x) => (x.includes('#') ? x.split('#')[0] : x))
      .map((x) => ({ pathName: x, isHash: false })),
    ...(location.hash
      ? [{ pathName: location.hash.replace('#', ''), isHash: true }]
      : [])
  ].map(({ isHash, pathName }) => {
    if (!isHash) {
      href += `/${pathName}`;
    } else {
      href += `#${pathName}`;
    }
    return {
      isHash,
      pathName,
      href: href.slice(1)
    };
  });

  const handleClick = (href: string) => {
    navigate(href);
  };

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
