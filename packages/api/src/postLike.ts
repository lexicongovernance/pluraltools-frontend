import { PostLikeRequest, PostLikeResponse } from './types';

async function postLike({ commentId }: PostLikeRequest): Promise<PostLikeResponse | null> {
  try {
    const response = await fetch(
      `${process.env.VITE_SERVER_URL}/api/comments/${commentId}/likes`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

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

export default postLike;
