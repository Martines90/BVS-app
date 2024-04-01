import { USER_MODES } from '@global/types/user';
import { ReactElement } from 'react';

export type SubMenuItem = {
  label: string;
  route: string;
  modes: USER_MODES[];
};

export type MenuItem = {
  icon: ReactElement;
  label: string;
  route: string;
  modes: USER_MODES[];
  subMenuItems: SubMenuItem[];
};
