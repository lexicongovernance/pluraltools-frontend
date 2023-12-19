export type ResponseRegistrationOptionsType = {
  [categoryName: string]: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    category: string;
  }[];
};
