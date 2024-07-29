import { RegistrationStatus } from './Registrations';

export type GetRegistrationDataResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
  registrationId: string;
  registrationFieldId: string;
  value: string;
}[];

export type PostRegistrationRequest = {
  eventId: string;
  groupId: string | null;
  status: RegistrationStatus;
  data: Record<
    string,
    {
      value: string | number | boolean | string[] | null;
      type: 'TEXT' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX' | 'MULTI_SELECT' | 'NUMBER';
      fieldId: string;
    }
  >;
};

export type PutRegistrationRequest = {
  eventId: string;
  groupId: string | null;
  status: RegistrationStatus;
  data: Record<
    string,
    {
      value: string | number | boolean | string[] | null;
      type: 'TEXT' | 'TEXTAREA' | 'SELECT' | 'CHECKBOX' | 'MULTI_SELECT' | 'NUMBER';
      fieldId: string;
    }
  >;
};

export type PostRegistrationResponse = {
  data: unknown | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  eventId: string;
  status: RegistrationStatus;
};

export type PutRegistrationResponse = {
  registrationData: unknown | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  eventId: string;
  status: RegistrationStatus;
};
