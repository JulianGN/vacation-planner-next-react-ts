export const getArrayNumbersBetween = (
  number1: number,
  number2: number
): number[] => {
  return Array.from({ length: number2 - number1 }, (_, i) => i + number1);
};

export const getArrayDatesBetween = (start: Date, end: Date): Date[] => {
  const dates = [];
  let currentDate = new Date(start);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
