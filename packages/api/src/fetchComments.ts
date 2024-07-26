import { ApiRequest, GetCommentsRequest, GetCommentsResponse } from './types';

export async function fetchComments({
  optionId,
  serverUrl,
}: ApiRequest<GetCommentsRequest>): Promise<GetCommentsResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/options/${optionId}/comments`, {
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });

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
