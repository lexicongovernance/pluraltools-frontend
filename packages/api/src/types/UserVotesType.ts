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
  cycleId: string;
};

export type PostVotesResponse = {
  data: GetUserVotesResponse;
  errors: string[];
};
