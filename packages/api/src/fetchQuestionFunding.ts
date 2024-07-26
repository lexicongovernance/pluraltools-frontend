import { GetFundingResponse } from './types';

export async function fetchQuestionFunding(questionId: string): Promise<GetFundingResponse | null> {
  try {
    const response = await fetch(
      `${process.env.VITE_SERVER_URL}/api/questions/${questionId}/funding`,
      {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
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

