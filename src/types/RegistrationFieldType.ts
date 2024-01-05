import { RegistrationFieldOption } from './RegistrationFieldOptionType';

export type GetRegistrationFieldsResponse = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  eventId: string;
  type: 'SELECT' | 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN';
  isRequired: boolean | null;
  registrationFieldOptions: RegistrationFieldOption[];
}[];
