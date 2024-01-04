export type Question = {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  cycleId: string;
  title: string;
};

export type Option = {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  text: string;
  voteCount: number;
};

export type Cycle = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'OPEN' | 'CLOSED' | 'RESULTS' | null;
  startAt: string;
  endAt: string;
};

export type ResponseUserVotesType = {
  id: string;
  userId: string;
  optionId: string;
  numOfVotes: number;
  createdAt: string;
  updatedAt: string;
}[];

export type ResponseCycleType = {
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
    description: string | null;
    cycleId: string;
    title: string;
    questionOptions: {
      id: string;
      createdAt: string;
      updatedAt: string;
      questionId: string;
      text: string;
      voteCount: number;
    }[];
  }[];
}[];
