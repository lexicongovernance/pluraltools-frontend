export type RegistrationStatus = 'DRAFT' | 'APPROVED' | 'PUBLISHED' | null;

export type GetRegistrationsResponseType = {
  id?: string | undefined;
  status: RegistrationStatus;
  userId: string;
  groupId: string | null;
  eventId?: string | undefined;
  createdAt: string;
  updatedAt: string;
}[];
