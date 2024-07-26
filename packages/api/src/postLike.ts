import { ApiRequest, PostLikeRequest, PostLikeResponse } from './types';

export async function postLike({
  commentId,
  serverUrl,
}: ApiRequest<PostLikeRequest>): Promise<PostLikeResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/comments/${commentId}/likes`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const like = (await response.json()) as { data: PostLikeResponse };
    return like.data;
  } catch (error) {
    console.error('Error during POST like request:', error);
    return null;
  }
}
