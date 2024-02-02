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
    }
  >;
};

export type Question = {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  cycleId: string;
  title: string;
};
