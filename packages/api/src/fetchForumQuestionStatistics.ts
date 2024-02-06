import { GetForumQuestionStatisticsResponse } from './types/ForumQuestionType';

async function fetchForumQuestionStatistics(
  questionId: string
): Promise<GetForumQuestionStatisticsResponse | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/forum-questions/${questionId}/statistics`,
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

    const stats = (await response.json()) as { data: GetForumQuestionStatisticsResponse };
    return stats.data;
  } catch (error) {
    console.error('Error fetching forum question statistics:', error);
    return null;
  }
}

export default fetchForumQuestionStatistics;
