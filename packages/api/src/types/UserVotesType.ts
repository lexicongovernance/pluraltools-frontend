export type GetUserVotesResponse = {
  id: string;
  userId: string;
  optionId: string;
  numOfVotes: number;
  createdAt: string;
  updatedAt: string;
}[];

export type PostVoteRequest = {
  optionId: string;
  numOfVotes: number;
};
