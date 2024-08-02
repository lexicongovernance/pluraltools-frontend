export type Option = {
  id: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  title: string;
  userId?: string;
  subTitle?: string;
  accepted: boolean;
  data: unknown;
  fundingRequest: string;
};

export type GetOptionRequest = {
  optionId: string;
};

export type GetOptionResponse = Option;
