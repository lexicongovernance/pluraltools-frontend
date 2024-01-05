export type GetRegistrationDataResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  registrationId: string;
  registrationFieldId: string;
  value: string;
}[];

export type PostRegistrationDataRequest = {
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED' | null;
  registrationData: {
    registrationFieldId: string;
    value: string;
  }[];
};

export type PostRegistrationDataResponse = {
  registrationData:
    | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        registrationId: string;
        registrationFieldId: string;
        value: string;
      }[]
    | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  eventId: string;
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED' | null;
};
