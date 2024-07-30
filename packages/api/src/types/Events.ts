export type GetEventResponse = {
  id: string;
  name: string;
  imageUrl: string;
  link: string | null;
  registrationDescription: string | null;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  status: 'OPEN' | 'CLOSED' | 'UPCOMING' | null;
};

export type GetEventsResponse = GetEventResponse[];
