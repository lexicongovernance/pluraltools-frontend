import { PostUsersToGroupsResponse, PutUsersToGroupsRequest } from './types';

export async function putUsersToGroups({
  groupId,
  userToGroupId,
}: PutUsersToGroupsRequest): Promise<PostUsersToGroupsResponse | { errors: string[] } | null> {
  try {
    const response = await fetch(
      `${process.env.VITE_SERVER_URL}/api/users-to-groups/${userToGroupId}`,
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
      if (response.status < 500) {
        const errors = (await response.json()) as { errors: string[] };
        return errors;
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
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
