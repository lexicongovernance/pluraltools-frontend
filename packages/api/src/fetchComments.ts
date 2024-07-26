import { GetCommentsRequest, GetCommentsResponse } from './types';

export async function fetchComments({
  optionId,
}: GetCommentsRequest): Promise<GetCommentsResponse | null> {
  try {
    const response = await fetch(
      `${process.env.VITE_SERVER_URL}/api/options/${optionId}/comments`,
      {
        credentials: 'include',
        headers: {
          'Content-type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const comments = (await response.json()) as { data: GetCommentsResponse };
    return comments.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return null;
  }
}
