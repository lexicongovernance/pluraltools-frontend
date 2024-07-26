import { ApiRequest, GetEventsResponse } from './types';

export async function fetchEvents({
  serverUrl,
}: ApiRequest<unknown>): Promise<GetEventsResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/events`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = (await response.json()) as { data: GetEventsResponse };
    return res.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return null;
  }
}
