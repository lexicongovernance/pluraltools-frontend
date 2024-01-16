import { ResponseUserVotesType } from '../types/CycleType';

async function fetchUserVotes(
  userId: string,
  forumQuestionId: string
): Promise<ResponseUserVotesType | null> {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_SERVER_URL
      }/api/users/${userId}/forum-questions/${forumQuestionId}/votes`,
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

    const userVotes = (await response.json()) as { data: ResponseUserVotesType };
    return userVotes.data;
  } catch (error) {
    console.error('Error fetching user votes:', error);
    return null;
  }
}

export default fetchUserVotes;
