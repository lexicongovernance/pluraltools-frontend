import { GetUserOptionsResponse } from './types/UserOptionType';

async function fetchUserOptions(userId: string): Promise<GetUserOptionsResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}/options`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const userOptions = (await response.json()) as { data: GetUserOptionsResponse };
    return userOptions.data;
  } catch (error) {
    console.error('Error fetching user options:', error);
    return null;
  }
}

export default fetchUserOptions;
