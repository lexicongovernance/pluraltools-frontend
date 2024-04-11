import { GetRegistrationResponseType } from './types/RegistrationType';

async function fetchRegistrations(eventId: string): Promise<GetRegistrationResponseType | null> {
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

    const registration = (await response.json()) as { data: GetRegistrationResponseType };
    if (!registration.data) {
      return null;
    }

    return registration.data;
  } catch (error) {
    console.error('error fetching registration', error);
    return null;
  }
}

export default fetchRegistrations;
