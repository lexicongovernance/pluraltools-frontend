import { ApiRequest } from './types';

export async function fetchSIWESession({
  serverUrl,
}: ApiRequest<unknown>): Promise<{ chainId: string; address: string } | null> {
  try {
    const response = await fetch(`${serverUrl}/api/auth/siwe/session`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const session = (await response.json()) as { chainId: string; address: string };
    return session;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
