export type Comment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  value: string;
  optionId: string | null;
};

export type GetCommentsRequest = {
  optionId: string;
};

export type GetCommentsResponse = (Comment & {
  user?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
})[];

export type PostCommentRequest = {
  value: string;
  optionId: string;
};

export type DeleteCommentRequest = {
  commentId: string;
};

export type PostCommentResponse = Comment;

export type DeleteCommentResponse = Comment;
