import { ApiRequest } from './types';

export async function fetchSIWENonce({ serverUrl }: ApiRequest<unknown>): Promise<string | null> {
  try {
    const response = await fetch(`${serverUrl}/api/auth/siwe/nonce`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const nonce = await response.text();
    return nonce;
  } catch (error) {
    console.error('Error fetching nonce:', error);
    return null;
  }
}
