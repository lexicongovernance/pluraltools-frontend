import { GetCyclesResponse } from './types';

export async function fetchCycle(cycleId: string): Promise<GetCyclesResponse[number] | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/cycles/${cycleId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const cycle = (await response.json()) as { data: GetCyclesResponse[number] };
    return cycle.data;
  } catch (error) {
    console.error('Error fetching cycles:', error);
    return null;
  }
}

