import { GetUsersToGroupsResponse } from './types';

async function fetchUsersToGroups(userId: string): Promise<GetUsersToGroupsResponse | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/${userId}/users-to-groups`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const userGroups = (await response.json()) as { data: GetUsersToGroupsResponse };
    return userGroups.data;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return null;
  }
}

export default fetchUsersToGroups;
