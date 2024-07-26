import { DeleteUsersToGroupsRequest, DeleteUsersToGroupsResponse } from './types';

export async function deleteUsersToGroups({
  userToGroupId,
}: DeleteUsersToGroupsRequest): Promise<DeleteUsersToGroupsResponse | { errors: string[] } | null> {
  try {
    const response = await fetch(
      `${process.env.VITE_SERVER_URL}/api/users-to-groups/${userToGroupId}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      if (response.status < 500) {
        const errors = (await response.json()) as { errors: string[] };
        return errors;
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
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
