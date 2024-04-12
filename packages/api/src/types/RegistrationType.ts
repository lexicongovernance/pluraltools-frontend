export type RegistrationStatus = 'DRAFT' | 'APPROVED' | 'PUBLISHED' | null;
export type GetRegistrationResponseType = {
  userId: string;
  id?: string | undefined;
  eventId?: string | undefined;
  status: RegistrationStatus;
};

export type GetRegistrationsResponseType = GetRegistrationResponseType[];
