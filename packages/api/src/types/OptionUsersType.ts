import { GetGroupsResponse } from './GroupType';
import { GetUserResponse } from './UserType';

export type GetOptionUsersResponse = {
  optionId: string;
  registrationId: string | null;
  userId: string | null;
  user: GetUserResponse | null;
  groupId: string | null;
  group: GetGroupsResponse | null;
};
