export type RegistrationStatus = 'DRAFT' | 'APPROVED' | 'PUBLISHED' | null;

export type GetRegistrationResponseType = {
  id?: string | undefined;
  status: RegistrationStatus;
  userId: string;
  groupId: string | null;
  eventId?: string | undefined;
  createdAt: string;
  updatedAt: string;
};

export type GetRegistrationsResponseType = GetRegistrationResponseType[];
