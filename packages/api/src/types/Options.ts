export type Option = {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  optionTitle: string;
  userId?: string;
  optionSubTitle?: string;
  accepted: boolean;
  data: unknown;
  fundingRequest: string;
};

export type GetOptionRequest = {
  optionId: string;
};

export type GetOptionResponse = Option;
