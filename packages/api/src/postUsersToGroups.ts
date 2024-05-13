import { PostUsersToGroupsRequest, PostUsersToGroupsResponse } from './types';

async function postUserToGroups({
  secret,
  groupId,
}: PostUsersToGroupsRequest): Promise<PostUsersToGroupsResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users-to-groups`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secret, groupId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
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

export default postUserToGroups;
