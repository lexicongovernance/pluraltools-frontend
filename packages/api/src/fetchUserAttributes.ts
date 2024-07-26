import { GetUserAttributesResponse } from './types';

export async function fetchUserAttributes(
  userId: string,
): Promise<GetUserAttributesResponse | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/users/${userId}/attributes`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const userAttributes = (await response.json()) as { data: GetUserAttributesResponse };
    return userAttributes.data;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return null;
  }
}
