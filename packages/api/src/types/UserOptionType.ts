export type GetUserOptionsResponse = {
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
  fundingRequest: string | null;
  forumQuestion: {
    id: string;
    createdAt: string;
    updatedAt: string;
    description: string | null;
    cycleId: string;
    title: string;
  };
}[];
