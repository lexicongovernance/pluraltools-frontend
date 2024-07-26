import { ApiRequest, PostGroupRequest, PostGroupResponse } from './types';

export async function postGroup({
  name,
  groupCategoryId,
  serverUrl,
}: ApiRequest<PostGroupRequest>): Promise<PostGroupResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/groups`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, groupCategoryId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const group = (await response.json()) as { data: PostGroupResponse };
    return group.data;
  } catch (error) {
    console.error('Error during POST group request:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    return null;
  }
}
