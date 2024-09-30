export const getArrayNumbersBetween = (
  number1: number,
  number2: number
): number[] => {
  return Array.from({ length: number2 - number1 }, (_, i) => i + number1);
};
