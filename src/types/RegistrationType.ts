export type GetRegistrationResponseType = {
  userId: string;
  id?: string | undefined;
  eventId?: string | undefined;
  status?: 'DRAFT' | 'PUBLISHED' | 'APPROVED' | undefined;
};
