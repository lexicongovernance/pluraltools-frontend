import { ApiRequest } from './types';

export async function logout({ serverUrl }: ApiRequest<unknown>) {
  try {
    const response = await fetch(`${serverUrl}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Logout failed');
  }
}
