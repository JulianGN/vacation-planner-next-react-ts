import { WorkDay } from "@/domain/enums/WorkDay";

export const maxSplitPeriod = 3;
export const minPeriodDays = 5;
export const minPeriodForAtLeastOneWhenSplit = 14;
export const minVacationInterval = 30;
export const weekDays = Object.values(WorkDay).filter(
  (day) => typeof day === "number"
);
