export type GetOptionUsersResponse = {
  optionId: string;
  registrationId: string | null;
  userId: string | null;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  } | null;
  groupId: string | null;
  group: {
    id: null;
    users:
      | {
          id: string;
          username: string;
          firstName: string;
          lastName: string;
        }[]
      | null;
  } | null;
};
