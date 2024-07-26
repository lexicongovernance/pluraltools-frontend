import { ApiRequest, PostVotesRequest, PostVotesResponse } from './types';

export async function postVotes({
  votes,
  serverUrl,
}: ApiRequest<PostVotesRequest>): Promise<PostVotesResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/votes`, {
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
