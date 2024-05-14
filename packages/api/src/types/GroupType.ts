export type GetGroupsResponse = {
  id: string;
  name: string;
  description: string | null;
  secret: string | null;
  createdAt: string;
  updatedAt: string;
  groupCategoryId?: string;
  groupCategory?: {
    id: string;
    name: string;
    eventId: string;
    userCanCreate: boolean;
    userCanView: boolean;
    createdAt: string;
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
