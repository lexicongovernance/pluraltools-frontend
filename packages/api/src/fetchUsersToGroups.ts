import { ApiRequest, GetUsersToGroupsResponse } from './types';

export async function fetchUsersToGroups({
  serverUrl,
  userId,
}: ApiRequest<{ userId: string }>): Promise<GetUsersToGroupsResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/users/${userId}/users-to-groups`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
