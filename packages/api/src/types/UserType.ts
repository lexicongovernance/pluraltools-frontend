export type GetUserResponse = {
  id: string;
  username: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PutUserRequest = {
  userId: string;
  username: string;
  email?: string;
  groupIds: string[];
  userAttributes: Record<string, string>;
};
