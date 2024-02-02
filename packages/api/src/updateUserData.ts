import { PutUserRequest, GetUserResponse } from './types/UserType';

async function updateUserData({
  userId,
  username,
  email,
  groupIds,
  userAttributes,
}: PutUserRequest): Promise<GetUserResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupIds,
        username,
        email,
        userAttributes,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const user = (await response.json()) as { data: GetUserResponse };
    return user.data;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

export default updateUserData;
