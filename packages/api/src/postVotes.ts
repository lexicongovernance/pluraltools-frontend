import { PostVotesRequest, PostVotesResponse } from './types/UserVotesType';

async function postVotes({ cycleId, votes }: PostVotesRequest): Promise<PostVotesResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/cycles/${cycleId}/votes`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(votes),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const votesRes = (await response.json()) as PostVotesResponse;
    return votesRes;
  } catch (error) {
    console.error('Error during POST vote request:', error);
    return null;
  }
}

export default postVotes;
