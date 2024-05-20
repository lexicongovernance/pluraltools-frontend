import { GetUserAttributesResponse } from './types';

async function fetchUserAttributes(userId: string): Promise<GetUserAttributesResponse | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/${userId}/attributes`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

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

export default fetchUserAttributes;
