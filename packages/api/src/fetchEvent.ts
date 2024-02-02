import { GetEventResponse } from './types/EventType';

async function fetchEvent(eventId: string): Promise<GetEventResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/events/${eventId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = (await response.json()) as { data: GetEventResponse };
    return res.data;
  } catch (error) {
    console.error(`Error fetching event with id ${eventId}:`, error);
    return null;
  }
}

export default fetchEvent;
