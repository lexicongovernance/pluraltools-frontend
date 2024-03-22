export type GetUserResponse = {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  telegram: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PutUserRequest = {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  groupIds: string[];
  telegram?: string;
  userAttributes: Record<string, string>;
};
