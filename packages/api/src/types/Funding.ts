export type GetFundingResponse = {
  allocated_funding: {
    [key: string]: number;
  };
  remaining_funding: number;
};
