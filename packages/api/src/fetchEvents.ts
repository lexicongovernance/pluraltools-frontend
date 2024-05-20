import { GetEventsResponse } from './types';

async function fetchEvents(): Promise<GetEventsResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/events`, {
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

export default fetchEvents;
