/* eslint-disable import/prefer-default-export */
import { Location } from 'react-router-dom';
import { PathChunk } from './types';

export const getBreadcrumbMapFromUrl = (
  location: Location<any>
): PathChunk[] => {
  let href = '';

  const hash = location.hash.split('?')[0];

  const pathnames: PathChunk[] = [
    ...location.pathname
      .split('/')
      .filter((x) => x)
      .map((x) => (x.includes('#') ? x.split('#')[0] : x))
      .map((x) => ({ pathName: x, isHash: false })),
    ...(hash
      ? [{ pathName: hash.replace('#', ''), isHash: true }]
      : [])
  ].map(({ isHash, pathName }) => {
    if (!isHash) {
      href += `/${pathName}`;
    } else {
      href += `#${pathName}`;
    }
    const _pathName = pathName
      .split(/-|_/)
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join(' ');

    return {
      isHash,
      pathName: _pathName,
      href: href.slice(1)
    };
  });

  return pathnames;
};
