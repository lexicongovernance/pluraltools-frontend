import { PostUsersToGroupsRequest, PostUsersToGroupsResponse } from './types';

export async function postUsersToGroups({
  secret,
  groupId,
}: PostUsersToGroupsRequest): Promise<PostUsersToGroupsResponse | { errors: string[] } | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/users-to-groups`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secret, groupId }),
    });

    if (!response.ok) {
      if (response.status < 500) {
        const errors = (await response.json()) as { errors: string[] };
        return errors;
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const group = (await response.json()) as { data: PostUsersToGroupsResponse };
    return group.data;
  } catch (error) {
    console.error('Error during POST user to groups request:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    return null;
  }
}
