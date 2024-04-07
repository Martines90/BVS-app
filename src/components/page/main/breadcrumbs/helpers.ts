import { Location } from 'react-router-dom';
import { PathChunk } from './types';

export const getBreadcrumbMapFromUrl = (
  location: Location<any>
): PathChunk[] => {
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
    pathName = pathName
      .split(/\-|_/)
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(' ');

    return {
      isHash,
      pathName,
      href: href.slice(1)
    };
  });

  return pathnames;
};
