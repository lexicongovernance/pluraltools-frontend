export type PostUserToGroupsRequest = {
  groupId?: string;
  secret?: string;
};

export type PostUserToGroupsResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  groupCategoryId: string | null;
  groupId: string;
};
