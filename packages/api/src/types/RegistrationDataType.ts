import { RegistrationStatus } from './RegistrationType';

export type GetRegistrationDataResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  registrationId: string;
  registrationFieldId: string;
  value: string;
}[];

export type PostRegistrationRequest = {
  status: RegistrationStatus;
  registrationData: {
    registrationFieldId: string;
    value: string;
  }[];
};

export type PutRegistrationRequest = {
  eventId: string;
  status: RegistrationStatus;
  registrationData: {
    registrationFieldId: string;
    value: string;
  }[];
};

export type PostRegistrationResponse = {
  registrationData:
    | {
        id: string;
        createdAt: string;
        updatedAt: string;
        registrationId: string;
        registrationFieldId: string;
        value: string;
      }[]
    | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  eventId: string;
  status: RegistrationStatus;
};

export type PutRegistrationResponse = {
  registrationData:
    | {
        id: string;
        createdAt: string;
        updatedAt: string;
        registrationId: string;
        registrationFieldId: string;
        value: string;
      }[]
    | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  eventId: string;
  status: RegistrationStatus;
};
