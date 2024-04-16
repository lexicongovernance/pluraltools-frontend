import { GetAlertsResponse } from './types/AlertType';

async function fetchAlerts(): Promise<GetAlertsResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/alerts`, {
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
    console.error('Error fetching cycles:', error);
    return null;
  }
}

export default fetchAlerts;
