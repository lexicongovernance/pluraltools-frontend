import { PutUserRequest, GetUserResponse } from './types/UserType';

async function updateUserData({
  email,
  firstName,
  groupIds,
  lastName,
  telegram,
  userAttributes,
  userId,
  username,
}: PutUserRequest): Promise<{ data: GetUserResponse } | { errors: string[] } | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        groupIds,
        lastName,
        telegram,
        userAttributes,
        username,
      }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errors = (await response.json()) as { errors: string[] };
        return errors;
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const user = (await response.json()) as { data: GetUserResponse } | { errors: string[] };
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

export default updateUserData;
