export type GetForumQuestionStatisticsResponse = {
  numProposals: number;
  sumNumOfHearts: number;
  numOfParticipants: number;
  numOfGroups: number;
  optionStats: Record<
    string,
    {
      optionTitle: string;
      pluralityScore: string;
      distinctUsers: string;
      allocatedHearts: string;
      optionSubTitle: string;
      distinctGroups: number;
      listOfGroupNames: string[];
    }
  >;
};
