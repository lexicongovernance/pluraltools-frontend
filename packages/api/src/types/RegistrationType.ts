export type RegistrationStatus = 'DRAFT' | 'APPROVED' | 'PUBLISHED' | null;
export type GetRegistrationsResponseType = {
  userId: string;
  id?: string | undefined;
  eventId?: string | undefined;
  status: RegistrationStatus;
}[];
