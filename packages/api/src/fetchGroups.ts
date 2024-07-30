import { ApiRequest, GetGroupsResponse } from './types';

export async function fetchGroups({
  serverUrl,
  groupCategoryId,
}: ApiRequest<{ groupCategoryId: string }>): Promise<GetGroupsResponse[] | null> {
  try {
    const response = await fetch(`${serverUrl}/api/group-categories/${groupCategoryId}/groups`, {
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const groups = (await response.json()) as { data: GetGroupsResponse[] };
    return groups.data;
  } catch (error) {
    console.error('Error fetching groups:', error);
    return null;
  }
}
