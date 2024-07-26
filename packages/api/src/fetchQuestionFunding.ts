import { ApiRequest, GetFundingResponse } from './types';

export async function fetchQuestionFunding({
  serverUrl,
  questionId,
}: ApiRequest<{ questionId: string }>): Promise<GetFundingResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/questions/${questionId}/funding`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const stats = (await response.json()) as { data: GetFundingResponse };
    return stats.data;
  } catch (error) {
    console.error('Error fetching forum question funding:', error);
    return null;
  }
}
