export type GetUserVotesResponse = {
  id: string;
  userId: string;
  optionId: string;
  numOfVotes: number;
  createdAt: string;
  updatedAt: string;
}[];

export type PostVotesRequest = {
  votes: { optionId: string; numOfVotes: number }[];
};

export type PostVotesResponse = {
  data: GetUserVotesResponse;
  errors?: { message: string }[];
};
