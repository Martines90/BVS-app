import { UserMode } from '@global/types/user';
import { MenuItem } from './types';

export const getUserModeEnabledMenuItems = (
  userMode: UserMode | undefined,
  menuItems: MenuItem[]
): MenuItem[] => {
  return menuItems
    .filter(
      (menuItem) =>
        (userMode && menuItem.modes.includes(userMode)) ||
        !menuItem.modes.length
    )
    .map((menuItem) => ({
      ...menuItem,
      subMenuItems: menuItem.subMenuItems.filter(
        (subMenuItem) =>
          (userMode && subMenuItem.modes.includes(userMode)) ||
          !subMenuItem.modes.length
      )
    }));
};
