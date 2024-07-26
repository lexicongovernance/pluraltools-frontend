import { GetGroupCategoriesResponse } from './types';

export async function fetchGroupCategories(): Promise<GetGroupCategoriesResponse | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/group-categories`, {
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const groups = (await response.json()) as { data: GetGroupCategoriesResponse };
    return groups.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    return null;
  }
}
