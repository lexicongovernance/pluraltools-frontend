import { ApiRequest, DeleteLikeRequest, DeleteLikeResponse } from './types';

export async function deleteLike({
  commentId,
  serverUrl,
}: ApiRequest<DeleteLikeRequest>): Promise<DeleteLikeResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/comments/${commentId}/likes`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const like = (await response.json()) as { data: DeleteLikeResponse };
    return like.data;
  } catch (error) {
    console.error('Error during DELETE like request:', error);
    return null;
  }
}
