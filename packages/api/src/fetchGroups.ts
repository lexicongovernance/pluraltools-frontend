import { GetGroupsResponse } from './types';

async function fetchGroups({
  groupCategoryName,
}: {
  groupCategoryName: string;
}): Promise<GetGroupsResponse[] | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/group-categories/${groupCategoryName}/groups`,
      {
        credentials: 'include',
        headers: {
          'Content-type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const groups = (await response.json()) as { data: GetGroupsResponse[] };
    return groups.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    return null;
  }
}

export default fetchGroups;
