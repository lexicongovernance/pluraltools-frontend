type Question = {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  cycleId: string;
  title: string;
};

type Option = {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  text: string;
  voteCount: number;
};

type Cycle = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'OPEN' | 'CLOSED' | 'RESULTS' | null;
  startAt: string;
  endAt: string;
};

export type ResponseUserVoteType = {
  id: string;
  userId: string;
  optionId: string;
  numOfVotes: number;
  createdAt: string;
  updatedAt: string;
};

export type ResponseCycleType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'OPEN' | 'CLOSED' | 'RESULTS' | null;
  startAt: string;
  endAt: string;
  questions: {
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string | null;
    cycleId: string;
    title: string;
    options: {
      id: string;
      createdAt: string;
      updatedAt: string;
      questionId: string;
      text: string;
      voteCount: number;
    }[];
  }[];
}[];
