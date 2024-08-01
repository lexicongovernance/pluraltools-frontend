export type GetQuestionStatisticsResponse = {
  numProposals: number;
  sumNumOfHearts: number;
  numOfParticipants: number;
  numOfGroups: number;
  optionStats: Record<
    string,
    {
      title: string;
      pluralityScore: string;
      distinctUsers: number;
      allocatedHearts: number;
      subTitle: string;
      distinctGroups: number;
      listOfGroupNames: string[];
      quadraticScore: string;
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
  fields: unknown;
};
