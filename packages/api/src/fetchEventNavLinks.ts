import { ApiRequest, GetNavLinksResponse } from './types';

export async function fetchEventNavLinks({
  serverUrl,
  eventId,
}: ApiRequest<{ eventId: string }>): Promise<GetNavLinksResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/events/${eventId}/nav-links`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const alerts = (await response.json()) as { data: GetNavLinksResponse };
    return alerts.data;
  } catch (error) {
    console.error('Error fetching event nav links:', error);
    return null;
  }
}
