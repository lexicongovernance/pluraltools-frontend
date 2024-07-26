import { ApiRequest, GetRegistrationFieldsResponse } from './types';

export async function fetchRegistrationFields({
  serverUrl,
  eventId,
}: ApiRequest<{ eventId: string }>): Promise<GetRegistrationFieldsResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/events/${eventId}/registration-fields`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = (await response.json()) as { data: GetRegistrationFieldsResponse };
    return res.data;
  } catch (error) {
    console.error('Error fetching registration fields:', error);
    return null;
  }
}
