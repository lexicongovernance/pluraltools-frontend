import { PostGroupRequest, PostGroupResponse } from './types';

export async function postGroup({
  name,
  groupCategoryId,
}: PostGroupRequest): Promise<PostGroupResponse | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/groups`, {
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
