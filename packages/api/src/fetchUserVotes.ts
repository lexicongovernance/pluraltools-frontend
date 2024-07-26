import { GetUserVotesResponse } from './types';

async function fetchUserVotes(cycleId: string): Promise<GetUserVotesResponse | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/cycles/${cycleId}/votes`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const userVotes = (await response.json()) as { data: GetUserVotesResponse };
    return userVotes.data;
  } catch (error) {
    console.error('Error fetching user votes:', error);
    return null;
  }
}

export default fetchUserVotes;
