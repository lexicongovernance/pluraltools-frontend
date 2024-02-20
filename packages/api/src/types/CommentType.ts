type Comment = {
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

export type GetCommentsResponse = Comment[];

export type PostCommentRequest = {
  value: string;
  questionOptionId: string;
};

export type PostCommentResponse = Comment;
