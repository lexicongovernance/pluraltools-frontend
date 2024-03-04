export type QuestionOption = {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  optionTitle: string;
  optionSubTitle?: string;
  accepted: boolean;
  voteScore: number;
  user: {
    group: {
      id: string;
      name: string;
    };
    username: string;
  };
};

export type GetQuestionOptionRequest = {
  optionId: string;
};

export type GetQuestionOptionResponse = QuestionOption;
