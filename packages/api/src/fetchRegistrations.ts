import { GetRegistrationsResponseType } from './types';

export async function fetchRegistrations(
  eventId: string,
): Promise<GetRegistrationsResponseType | null> {
  try {
    const response = await fetch(
      `${process.env.VITE_SERVER_URL}/api/events/${eventId}/registrations`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const registrations = (await response.json()) as { data: GetRegistrationsResponseType };
    if (!registrations.data) {
      return null;
    }

    return registrations.data;
  } catch (error) {
    console.error('error fetching registrations', error);
    return null;
  }
}
