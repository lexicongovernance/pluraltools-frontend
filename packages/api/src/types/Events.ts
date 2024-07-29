export type GetEventResponse = {
  id: string;
  name: string;
  imageUrl: string;
  link: string | null;
  registrationDescription: string | null;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  fields: unknown;
};

export type GetEventsResponse = GetEventResponse[];
