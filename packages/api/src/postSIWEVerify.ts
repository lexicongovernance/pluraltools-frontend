import { ApiRequest, GetUserResponse } from './types';

export async function postSIWEVerify({
  serverUrl,
  message,
  signature,
}: ApiRequest<{
  message: string;
  signature: string;
}>): Promise<GetUserResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/auth/siwe/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, signature }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const user = (await response.json()) as { data: GetUserResponse };
    return user.data;
  } catch (error) {
    console.error('Error during POST verify request:', error);
    return null;
  }
}
