import { GetGroupMembers } from './types/GroupMembersType';

async function fetchGroupRegistrations(groupId: string): Promise<GetGroupMembers | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/groups/${groupId}/registrations`,
      {
        credentials: 'include',
        headers: {
          'Content-type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const groups = (await response.json()) as { data: GetGroupMembers };
    return groups.data;
  } catch (error) {
    console.error('Error fetching group registrations:', error);
    return null;
  }
}

export default fetchGroupRegistrations;
