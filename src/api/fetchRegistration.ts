import { GetRegistrationResponseType } from '../types/RegistrationType';

async function fetchRegistration(eventId: string): Promise<GetRegistrationResponseType | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/events/${eventId}/registration`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const registration = (await response.json()) as { data: GetRegistrationResponseType };
    return registration.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default fetchRegistration;
