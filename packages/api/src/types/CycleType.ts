export type Cycle = {
  id: string;
  eventId: string | null;
  createdAt: string;
  updatedAt: string;
  status: 'OPEN' | 'CLOSED' | 'RESULTS' | null;
  startAt: string;
  endAt: string;
};

export type GetCyclesResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'OPEN' | 'CLOSED' | 'RESULTS' | null;
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
      voteCount: number;
    }[];
  }[];
}[];
