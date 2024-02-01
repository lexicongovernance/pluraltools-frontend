import { RegistrationStatus } from './RegistrationType';

export type GetRegistrationDataResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  registrationId: string;
  registrationFieldId: string;
  value: string;
}[];

export type PostRegistrationDataRequest = {
  status: RegistrationStatus;
  registrationData: {
    registrationFieldId: string;
    value: string;
  }[];
};

export type PostRegistrationDataResponse = {
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
