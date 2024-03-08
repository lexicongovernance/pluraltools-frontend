export type GetUserResponse = {
  id: string;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  emailNotification: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PutUserRequest = {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  emailNotification?: boolean;
  email?: string;
  groupIds: string[];
  userAttributes: Record<string, string>;
};
