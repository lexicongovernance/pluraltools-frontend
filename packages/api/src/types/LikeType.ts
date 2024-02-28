type Like = {
  id: string;
  createdAt: Date;
  userId: string | null;
  commentId: string | null;
};

export type GetLikesRequest = {
  commentId: string;
};

export type GetLikesResponse = Like[];

export type PostLikeRequest = {
  commentId: string;
};

export type PostLikeResponse = Like;

export type DeleteLikeRequest = {
  commentId: string;
};

export type DeleteLikeResponse = Like;
