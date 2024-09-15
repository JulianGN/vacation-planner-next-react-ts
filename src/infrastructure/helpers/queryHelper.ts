export const getEqObjectId = (propToCompare: string, id: string) => ({
  $eq: [`$${propToCompare}`, { $toObjectId: id }],
});
