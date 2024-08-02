import { ApiRequest, GetGroupCategoriesResponse } from './types';

export async function fetchGroupCategories({
  serverUrl,
}: ApiRequest<unknown>): Promise<GetGroupCategoriesResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/group-categories`, {
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
