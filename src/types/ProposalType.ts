type GroupsUsers = {
  userId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  groupId: string;
};

type RegistrationOptions = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  registrationOptionId: string;
  registrationOption: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    category: string;
  };
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
  registrationOptions: RegistrationOptions[];
};

export type PostProposalType = {
  userId: string;
  email?: string | undefined;
  username?: string | undefined;
  id?: string | undefined;
  proposalTitle: string;
  proposalAbstract?: string | undefined;
  status?: 'DRAFT' | 'PUBLISHED' | undefined;
  groupIds: string[];
  registrationOptionIds: string[];
};
