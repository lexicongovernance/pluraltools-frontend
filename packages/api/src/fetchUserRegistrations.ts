import { GetRegistrationsResponseType } from './types';

async function fetchUserRegistrations(
  userId: string,
): Promise<GetRegistrationsResponseType | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/${userId}/registrations`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const userGroups = (await response.json()) as { data: GetRegistrationsResponseType };
    return userGroups.data;
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return null;
  }
}

export default fetchUserRegistrations;
