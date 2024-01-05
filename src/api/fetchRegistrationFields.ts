import { GetRegistrationFieldsResponse } from '../types/RegistrationFieldType';

async function fetchRegistrationFields(
  eventId: string
): Promise<GetRegistrationFieldsResponse | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/events/${eventId}/registration-fields`,
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

    const res = (await response.json()) as { data: GetRegistrationFieldsResponse };
    return res.data;
  } catch (error) {
    console.error('Error fetching nonce:', error);
    return null;
  }
}

export default fetchRegistrationFields;
