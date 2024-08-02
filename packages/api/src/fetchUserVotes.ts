import { ApiRequest, GetUserVotesResponse } from './types';

export async function fetchUserVotes({
  serverUrl,
  cycleId,
}: ApiRequest<{ cycleId: string }>): Promise<GetUserVotesResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/cycles/${cycleId}/votes`, {
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
