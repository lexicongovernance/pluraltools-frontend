export type QuestionOption = {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  optionTitle: string;
  userId?: string;
  optionSubTitle?: string;
  accepted: boolean;
  fundingRequest: string;
};

export type GetQuestionOptionRequest = {
  optionId: string;
};

export type GetQuestionOptionResponse = QuestionOption;
