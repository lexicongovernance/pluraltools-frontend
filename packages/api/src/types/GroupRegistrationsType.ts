// This can be optimized

type RegistrationField = {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  type: 'SELECT' | 'TEXT' | 'NUMBER' | 'DATE' | 'BOOLEAN';
  required: boolean;
  fieldDisplayRank: number | null;
  characterLimit: number;
  forGroup: boolean;
  forUser: boolean;
  createdAt: string;
  updatedAt: string;
};

type RegistrationData = {
  id: string;
  registrationId: string;
  registrationFieldId: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  registrationField: RegistrationField;
};

type Registration = {
  id: string;
  userId: string;
  eventId: string;
  groupId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  registrationData: RegistrationData[];
};

export type GetGroupRegistration = {
  id: string;
  name: string;
  description: string | null;
  groupCategoryId: string;
  createdAt: string;
  updatedAt: string;
  registrations: Registration[];
}[];
