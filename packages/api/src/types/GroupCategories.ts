export type GetGroupCategoryResponse = {
  id: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  eventId: string | null;
  userCanCreate: boolean;
  userCanView: boolean;
  required: boolean;
};

export type GetGroupCategoriesResponse = GetGroupCategoryResponse[];
