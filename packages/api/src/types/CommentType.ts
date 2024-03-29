export type Comment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  value: string;
  questionOptionId: string | null;
};

export type GetCommentsRequest = {
  optionId: string;
};

export type GetCommentsResponse = (Comment & { user?: { id: string; username: string } })[];

export type PostCommentRequest = {
  value: string;
  questionOptionId: string;
};

export type DeleteCommentRequest = {
  optionId: string;
  commentId: string;
};

export type PostCommentResponse = Comment;

export type DeleteCommentResponse = Comment;
