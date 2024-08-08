import { ApiRequest, GetUserResponse } from './types';

export async function postZupassVerify({
  email,
  pcdStr,
  serverUrl,
  uuid,
}: ApiRequest<{
  pcdStr: string;
  email: string;
  uuid: string;
}>): Promise<GetUserResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/auth/zupass/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pcd: pcdStr, email: email, uuid: uuid }),
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
