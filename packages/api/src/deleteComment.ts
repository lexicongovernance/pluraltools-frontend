import { ApiRequest, DeleteCommentRequest, DeleteCommentResponse } from './types';

export async function deleteComment({
  commentId,
  serverUrl,
}: ApiRequest<DeleteCommentRequest>): Promise<DeleteCommentResponse | null> {
  try {
    const response = await fetch(`${serverUrl}/api/comments/${commentId}`, {
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
