import { GetAlertsResponse } from './types';

async function fetchAlerts(): Promise<GetAlertsResponse | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/alerts`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const alerts = (await response.json()) as { data: GetAlertsResponse };
    return alerts.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return null;
  }
}

export default fetchAlerts;
