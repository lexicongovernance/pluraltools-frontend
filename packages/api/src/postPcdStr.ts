import { GetUserResponse } from './types/UserType';

async function postPcdStr(pcdStr: string): Promise<GetUserResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/zupass/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pcd: JSON.parse(pcdStr).pcd }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const user = (await response.json()) as { data: GetUserResponse };
    return user.data;
  } catch (error) {
    console.error('Error during POST request:', error);
    return null;
  }
}

export default postPcdStr;
