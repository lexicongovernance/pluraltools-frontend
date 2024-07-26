import { GetRegistrationsResponseType } from './types';

export async function fetchUserRegistrations(
  userId: string,
): Promise<GetRegistrationsResponseType | null> {
  try {
    const response = await fetch(
      `${process.env.VITE_SERVER_URL}/api/users/${userId}/registrations`,
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

    const userRegistrations = (await response.json()) as { data: GetRegistrationsResponseType };
    return userRegistrations.data;
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return null;
  }
}
