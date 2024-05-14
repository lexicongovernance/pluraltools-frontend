import { DeleteUsersToGroupsRequest, DeleteUsersToGroupsResponse } from './types';

async function deleteUsersToGroups({
  userToGroupId,
}: DeleteUsersToGroupsRequest): Promise<DeleteUsersToGroupsResponse | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users-to-groups/${userToGroupId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const group = (await response.json()) as { data: DeleteUsersToGroupsResponse };
    return group.data;
  } catch (error) {
    console.error('Error during DELETE user to groups request:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    return null;
  }
}

export default deleteUsersToGroups;
