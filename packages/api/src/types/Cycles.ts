export type GetCycleResponse = {
  id: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  status: 'OPEN' | 'CLOSED' | 'UPCOMING' | null;
  startAt: string;
  endAt: string;
  questions: {
    id: string;
    showScore: boolean;
    createdAt: string;
    updatedAt: string;
    questionSubTitle: string | null;
    cycleId: string;
    title: string;
    options: {
      id: string;
      createdAt: string;
      updatedAt: string;
      questionId: string;
      title: string;
      subTitle?: string;
      accepted: boolean;
      voteScore?: number;
      fundingRequest: string;
      user?: {
        groups?: {
          id: string;
          name: string;
          groupCategory?: {
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
