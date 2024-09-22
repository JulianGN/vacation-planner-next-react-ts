export const geyEqByProp = (propToCompare: string, value: string) => ({
  $eq: [`$${propToCompare}`, value],
});

export const getEqByPropObjectId = (propToCompare: string, id: string) => ({
  $eq: [`$${propToCompare}`, { $toObjectId: id }],
});
