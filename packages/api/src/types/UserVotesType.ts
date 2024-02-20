export type GetUserVotesResponse = {
  id: string;
  userId: string;
  optionId: string;
  numOfVotes: number;
  createdAt: string;
  updatedAt: string;
}[];

export type PostVoteRequest = {
  votes: { optionId: string; numOfVotes: number }[];
  cycleId: string;
};
