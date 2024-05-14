type UsersToGroups = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  groupCategoryId: string | null;
  groupId: string;
};

export type GetUsersToGroupsResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  groupCategoryId: string | null;
  groupId: string;
  group: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
    secret: string | null;
    groupCategoryId: string | null;
    groupCategory?: {
      createdAt: string;
      eventId: string;
      id: string;
      name: string;
      updatedAt: string;
    };
  };
}[];

export type PostUsersToGroupsRequest = {
  groupId?: string;
  secret?: string;
};

export type PutUsersToGroupsRequest = {
  userToGroupId: string;
  groupId: string;
};

export type DeleteUsersToGroupsRequest = {
  userToGroupId: string;
};

export type PostUsersToGroupsResponse = UsersToGroups;
export type PutUsersToGroupsResponse = UsersToGroups;
export type DeleteUsersToGroupsResponse = UsersToGroups;
