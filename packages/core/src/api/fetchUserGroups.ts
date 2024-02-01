import { GetGroupsResponse } from '../types/GroupType';

async function fetchUserGroups(userId: string): Promise<GetGroupsResponse[] | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}/groups`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const userGroups = (await response.json()) as { data: GetGroupsResponse[] };
    return userGroups.data;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return null;
  }
}

export default fetchUserGroups;
