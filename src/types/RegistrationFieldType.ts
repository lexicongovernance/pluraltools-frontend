import { RegistrationFieldOption } from './RegistrationFieldOptionType';

export type GetRegistrationFieldsResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  eventId: string;
  type: 'SELECT' | 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN';
  isRequired: boolean | null;
  registrationFieldOptions: RegistrationFieldOption[];
}[];
