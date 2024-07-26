import { ApiRequest, GetGroupMembers } from './types';

export async function fetchGroupMembers({
  serverUrl,
  groupId,
}: ApiRequest<{ groupId: string }>): Promise<GetGroupMembers | null> {
  try {
    const response = await fetch(`${serverUrl}/api/groups/${groupId}/users-to-groups`, {
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const groups = (await response.json()) as { data: GetGroupMembers };
    return groups.data;
  } catch (error) {
    console.error('Error fetching group members:', error);
    return null;
  }
}
