import { ResponseUserVoteType } from '../types/CycleType';

async function fetchUserVotes(
  userId: string,
  optionId: string
): Promise<ResponseUserVoteType | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/users/${userId}/options/${optionId}/votes`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const userVotes = (await response.json()) as { data: ResponseUserVoteType };
    return userVotes.data;
  } catch (error) {
    console.error('Error fetchin user votes:', error);
    return null;
  }
}

export default fetchUserVotes;
