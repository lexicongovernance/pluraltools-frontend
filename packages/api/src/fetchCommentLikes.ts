import { GetLikesRequest, GetLikesResponse } from './types';

export async function fetchCommentLikes({
  commentId,
}: GetLikesRequest): Promise<GetLikesResponse | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/comments/${commentId}/likes`, {
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
