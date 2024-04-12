export type GetGroupsResponse = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  groupCategoryId?: string;
  groupCategory?: {
    createdAt: string;
    eventId: string;
    id: string;
    name: string;
    updatedAt: string;
  };
};
