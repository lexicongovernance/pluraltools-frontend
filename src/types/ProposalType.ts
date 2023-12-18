type GroupsUsers = {
  userId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  groupId: string;
};

export type ResponseProposalType = {
  userId: string;
  email?: string | undefined;
  username?: string | undefined;
  id?: string | undefined;
  proposalTitle: string;
  proposalAbstract?: string | undefined;
  status?: 'DRAFT' | 'PUBLISHED' | undefined;
  groups: GroupsUsers[];
};

export type PostProposalType = {
  userId: string;
  email?: string | undefined;
  username?: string | undefined;
  id?: string | undefined;
  proposalTitle: string;
  proposalAbstract?: string | undefined;
  status?: 'DRAFT' | 'PUBLISHED' | undefined;
  groupIds: string[] | null;
};
