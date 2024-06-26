import { DeleteCommentRequest, DeleteCommentResponse } from './types';

async function deleteComment({
  commentId,
}: DeleteCommentRequest): Promise<DeleteCommentResponse | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const comment = (await response.json()) as { data: DeleteCommentResponse };
    return comment.data;
  } catch (error) {
    console.error('Error during DELETE comment request:', error);
    return null;
  }
}

export default deleteComment;
