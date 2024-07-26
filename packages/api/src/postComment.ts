import { PostCommentRequest, PostCommentResponse } from './types';

export async function postComment({
  questionOptionId,
  value,
}: PostCommentRequest): Promise<PostCommentResponse | null> {
  try {
    const response = await fetch(`${process.env.VITE_SERVER_URL}/api/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ value, questionOptionId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const comments = (await response.json()) as { data: PostCommentResponse };
    return comments.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return null;
  }
}
