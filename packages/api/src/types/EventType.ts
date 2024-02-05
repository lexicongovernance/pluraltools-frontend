export type GetEventResponse = {
  id: string;
  name: string;
  imageUrl: string;
  registrationDescription: string | null;
  createdAt: string;
  updatedAt: string;
  description: string | null;
};

export type GetEventsResponse = GetEventResponse[];
