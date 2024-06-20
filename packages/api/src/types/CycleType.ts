export type GetCycleResponse = {
  id: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  status: 'OPEN' | 'CLOSED' | 'UPCOMING' | null;
  startAt: string;
  endAt: string;
  forumQuestions: {
    id: string;
    showScore: boolean;
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
      voteScore?: number;
      fundingRequest: string;
      user: {
        groups: {
          id: string;
          name: string;
          groupCategory: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            eventId: string | null;
            userCanCreate: boolean;
            userCanView: boolean;
            required: boolean;
          };
        }[];
        username: string;
        firstName: string;
        lastName: string;
      };
    }[];
  }[];
};

export type GetCyclesResponse = GetCycleResponse[];
