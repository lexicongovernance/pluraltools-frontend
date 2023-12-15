export type ProposalType = {
  userId: string;
  email?: string | null | undefined;
  username?: string | null | undefined;
  id?: string | undefined;
  proposalTitle: string;
  proposalAbstract?: string | undefined;
  status?: 'DRAFT' | 'PUBLISHED' | undefined;
  groups: [];
};
