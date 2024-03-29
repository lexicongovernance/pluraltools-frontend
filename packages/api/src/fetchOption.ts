import { GetQuestionOptionResponse } from './types';

async function fetchOption(optionId: string): Promise<GetQuestionOptionResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/options/${optionId}`, {
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP Error!, Status: ${response.status}`);
    }

    const option = (await response.json()) as { data: GetQuestionOptionResponse };
    return option.data;
  } catch (error) {
    console.error('Error fetching option:', error);
    return null;
  }
}

export default fetchOption;
