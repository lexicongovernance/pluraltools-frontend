import { GetUserVotesResponse, PostVoteRequest } from './types/UserVotesType';

async function postVote({ cycleId, votes }: PostVoteRequest): Promise<GetUserVotesResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/cycles/${cycleId}/votes`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        votes,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const vote = (await response.json()) as { data: GetUserVotesResponse };
    return vote.data;
  } catch (error) {
    console.error('Error during POST vote request:', error);
    return null;
  }
}

export default postVote;
