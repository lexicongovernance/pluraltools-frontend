type UsersToGroups = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  groupCategoryId: string | null;
  groupId: string;
};

export type PostUsersToGroupsRequest = {
  groupId?: string;
  secret?: string;
};

export type PutUsersToGroupsRequest = {
  userToGroupId: string;
  groupId: string;
};

export type PostUsersToGroupsResponse = UsersToGroups;
export type PutUsersToGroupsResponse = UsersToGroups;
