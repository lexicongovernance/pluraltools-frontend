import { DBEvent } from '../types/DBEventType';

async function fetchEvents(): Promise<DBEvent[] | null> {
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

    const res = (await response.json()) as { data: DBEvent[] };
    return res.data;
  } catch (error) {
    console.error('Error fetching nonce:', error);
    return null;
  }
}

export default fetchEvents;
