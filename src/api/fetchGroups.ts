type Group = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type GroupsResponse = {
  data: Group[];
};

async function fetchGroups(): Promise<Group[] | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/groups`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const groups: GroupsResponse = await response.json();
    return groups.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    return null;
  }
}

export default fetchGroups;
