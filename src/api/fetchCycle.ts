import { ResponseCycleType } from '../types/CycleType';

async function fetchCycle(cycleId: string): Promise<ResponseCycleType[number] | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/cycles/${cycleId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const cycle = (await response.json()) as { data: ResponseCycleType[number] };
    return cycle.data;
  } catch (error) {
    console.error('Error fetching cycles:', error);
    return null;
  }
}

export default fetchCycle;