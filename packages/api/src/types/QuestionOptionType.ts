export type QuestionOption = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
  registrationId: string | null;
  questionId: string;
  optionTitle: string;
  optionSubTitle: string | null;
  accepted: boolean | null;
  voteScore: string;
};

export type GetQuestionOptionRequest = {
  optionId: string;
};

export type GetQuestionOptionResponse = QuestionOption;
