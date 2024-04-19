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

export type PostGroupRequest = {
  name: string;
  groupCategoryId: string;
};

export type PostGroupResponse = {
  id: string;
  groupCategoryId: string | null;
  name: string;
  secret: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
};
