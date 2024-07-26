import { ApiRequest, GetCyclesResponse } from './types';

export async function fetchEventCycles({
  eventId,
  serverUrl,
}: ApiRequest<{ eventId: string }>): Promise<GetCyclesResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/events/${eventId}/cycles`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const cycle = (await response.json()) as { data: GetCyclesResponse };
    return cycle.data;
  } catch (error) {
    console.error('Error fetching cycles:', error);
    return null;
  }
}
