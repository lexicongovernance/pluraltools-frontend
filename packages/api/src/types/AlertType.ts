export type Alert = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  link: string | null;
  description: string | null;
  startAt: Date | null;
  endAt: Date | null;
  active: boolean | null;
  title: string;
};

export type GetAlertsResponse = Alert[];
