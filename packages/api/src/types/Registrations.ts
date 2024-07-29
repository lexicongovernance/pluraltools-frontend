export type RegistrationStatus = 'DRAFT' | 'APPROVED' | 'REJECTED' | null;

export type GetRegistrationResponseType = {
  id?: string | undefined;
  status: RegistrationStatus;
  userId: string;
  groupId: string | null;
  eventId?: string | undefined;
  createdAt: string;
  data: unknown;
  updatedAt: string;
  event?: {
    id: string;
    name: string;
    imageUrl: string;
    link: string | null;
    registrationDescription: string | null;
    createdAt: string;
    updatedAt: string;
    description: string | null;
  };
};

export type GetRegistrationsResponseType = GetRegistrationResponseType[];
