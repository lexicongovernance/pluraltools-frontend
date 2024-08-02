import { ApiRequest, GetUserResponse } from './types';

export async function fetchUser({
  serverUrl,
}: ApiRequest<unknown>): Promise<GetUserResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/users`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const user = (await response.json()) as { data: GetUserResponse };
    return user.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
