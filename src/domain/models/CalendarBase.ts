import { WorkDay } from "@/domain/enums/WorkDay";
import { Period } from "./CalculatorVacation";
import { HolidayViewModel } from "./HolidayViewModel";

export interface CalendarBaseProps {
  date: Date | string;
  workdays: WorkDay[];
  holidays: HolidayViewModel[];
  vacationPeriod: Period;
  showTitle?: boolean;
  acceptJumpBridge?: boolean;
}

export interface CalendarDay {
  date: Date;
  isHoliday: boolean;
  isWorkday: boolean;
  isVacationDay: boolean;
  isInsideFullVacationPeriod: boolean;
  isFirstDayVacation: boolean;
  isLastDayVacation: boolean;
  isFirstDayVacationWeek: boolean;
  isLastDayVacationWeek: boolean;
  isFirstDayFullVacation: boolean;
  isLastDayFullVacation: boolean;
}
