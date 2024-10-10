export const getDiffDays = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  if (!diffTime) return 0;

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};
