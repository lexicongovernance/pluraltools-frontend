export type QuestionOption = {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  optionTitle: string;
  optionSubTitle?: string;
  accepted: boolean;
};

export type GetQuestionOptionRequest = {
  optionId: string;
};

export type GetQuestionOptionResponse = QuestionOption;
