import { GetGroupsResponse } from '../types/GroupType';

/**
 * Formats an array of group objects by sorting alphabetically and placing "Other" and "None" at the beginning.
 * @param groups An array of group objects.
 * @returns An array of formatted group objects with "Other" and "None" placed at the beginning.
 */
export const formatGroups = (groups: GetGroupsResponse[] | null | undefined) => {
    return groups
      ?.sort((a, b) => a.name.localeCompare(b.name))
      ?.reduce((acc: { name: string; id: string; }[], group) => {
        if (group.name === 'Other' || group.name === 'None') {
          acc.unshift({ name: group.name, id: group.id });
        } else {
          acc.push({ name: group.name, id: group.id });
        }
        return acc;
      }, []) || [];
  };