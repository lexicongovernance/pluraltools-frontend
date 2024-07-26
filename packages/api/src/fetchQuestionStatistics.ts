import { ApiRequest, GetQuestionStatisticsResponse } from './types';

export async function fetchQuestionStatistics({
  serverUrl,
  questionId,
}: ApiRequest<{ questionId: string }>): Promise<GetQuestionStatisticsResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/questions/${questionId}/statistics`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const stats = (await response.json()) as { data: GetQuestionStatisticsResponse };
    return stats.data;
  } catch (error) {
    console.error('Error fetching forum question statistics:', error);
    return null;
  }
}
