import { ApiRequest } from './types';
import { GetUserOptionsResponse } from './types/UserOptions';

export async function fetchUserOptions({
  serverUrl,
  userId,
}: ApiRequest<{ userId: string }>): Promise<GetUserOptionsResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/users/${userId}/options`, {
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
