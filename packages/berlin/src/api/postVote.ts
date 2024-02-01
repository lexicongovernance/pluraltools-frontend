import { ResponseUserVotesType } from '../types/CycleType';

type PostVote = {
  optionId: string;
  numOfVotes: number;
};

async function postVote({ optionId, numOfVotes }: PostVote): Promise<ResponseUserVotesType | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/votes`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        optionId,
        numOfVotes,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const vote = (await response.json()) as { data: ResponseUserVotesType };
    return vote.data;
  } catch (error) {
    console.error('Error during POST request:', error);
    return null;
  }
}

export default postVote;
