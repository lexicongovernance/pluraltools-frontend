export type GetUserResponse = {
  id: string;
  username: string | null;
  email: string | null;
  name: string | null;
  emailNotification: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PutUserRequest = {
  userId: string;
  username: string;
  name?: string;
  emailNotification?: boolean;
  email?: string;
  groupIds: string[];
  userAttributes: Record<string, string>;
};
