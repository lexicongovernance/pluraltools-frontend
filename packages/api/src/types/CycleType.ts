export type GetCycleResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'OPEN' | 'CLOSED' | 'UPCOMING' | null;
  startAt: string;
  endAt: string;
  forumQuestions: {
    id: string;
    createdAt: string;
    updatedAt: string;
    questionSubTitle: string | null;
    cycleId: string;
    questionTitle: string;
    questionOptions: {
      id: string;
      createdAt: string;
      updatedAt: string;
      questionId: string;
      optionTitle: string;
      optionSubTitle?: string;
      accepted: boolean;
      voteScore: number;
    }[];
  }[];
};

export type GetCyclesResponse = GetCycleResponse[];
