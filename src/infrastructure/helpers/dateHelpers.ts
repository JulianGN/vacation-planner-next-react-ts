import { HolidayPeriod } from "@/domain/models/Holiday";

export const getDateExprPeriod = (period: HolidayPeriod) => {
  const startOfDay = new Date(period.start);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(period.end);
  endOfDay.setHours(23, 59, 59, 999);

  return [{ $gte: ["$date", startOfDay] }, { $lte: ["$date", endOfDay] }];
};

export const getPeriodIgnoringYear = (period: HolidayPeriod): HolidayPeriod => {
  // as db is storing the dates from year 2024, all the searches will be made with this year
  const year = 2024;
  const start = new Date(period.start).setFullYear(year);
  const difYears =
    new Date(period.end).getFullYear() - new Date(period.start).getFullYear();
  const end = new Date(period.end).setFullYear(year + difYears);
  return { start: new Date(start), end: new Date(end) };
};
