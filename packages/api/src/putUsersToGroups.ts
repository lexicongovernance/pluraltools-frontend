import { PostUsersToGroupsResponse, PutUsersToGroupsRequest } from './types';

async function postUsersToGroups({
  groupId,
  userToGroupId,
}: PutUsersToGroupsRequest): Promise<PostUsersToGroupsResponse | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users-to-groups/${userToGroupId}`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const group = (await response.json()) as { data: PostUsersToGroupsResponse };
    return group.data;
  } catch (error) {
    console.error('Error during PUT user to groups request:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    return null;
  }
}

export default postUsersToGroups;