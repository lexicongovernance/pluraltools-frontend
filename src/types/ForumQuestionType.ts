export type GetForumQuestionStatisticsResponse = {
  numProposals: number;
  sumNumOfHearts: number;
  numOfParticipants: number;
  numOfGroups: number;
  optionStats: Record<
    string,
    {
      optionTitle: string;
      pluralityScore: number;
      distinctUsers: number;
      allocatedHearts: number;
    }
  >;
};
