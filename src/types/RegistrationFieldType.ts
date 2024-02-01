import { RegistrationFieldOption } from './RegistrationFieldOptionType';

export type GetRegistrationFieldsResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  eventId: string;
  type: 'SELECT' | 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN';
  required: boolean | null;
  field_display_rank: number | null;
  registrationFieldOptions: RegistrationFieldOption[];
}[];
