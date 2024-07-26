import { ApiRequest, GetAlertsResponse } from './types';

export async function fetchAlerts({
  serverUrl,
}: ApiRequest<unknown>): Promise<GetAlertsResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/alerts`, {
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
