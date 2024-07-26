import { ApiRequest, GetLikesRequest, GetLikesResponse } from './types';

export async function fetchCommentLikes({
  commentId,
  serverUrl,
}: ApiRequest<GetLikesRequest>): Promise<GetLikesResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/comments/${commentId}/likes`, {
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const likes = (await response.json()) as { data: GetLikesResponse };
    return likes.data;
  } catch (error) {
    console.error('Error fetching likes:', error);
    return null;
  }
}
