import { GetRegistrationsResponseType } from './types/RegistrationType';

async function fetchRegistrations(eventId: string): Promise<GetRegistrationsResponseType | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/events/${eventId}/registrations`,
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

    console.log('registrations (api):', registrations);
    console.log('returned registrations (api):', registrations.data);
    return registrations.data;
  } catch (error) {
    console.error('error fetching registrations', error);
    return null;
  }
}

export default fetchRegistrations;
