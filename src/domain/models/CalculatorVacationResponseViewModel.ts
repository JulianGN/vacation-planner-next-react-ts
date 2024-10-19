import { WorkDay } from "@/domain/enums/WorkDay";
import { PeriodOption } from "@/domain/models/CalculatorVacation";
import { HolidayViewModel } from "./HolidayViewModel";

export interface CalculatorVacationResponseViewModel {
  bestPeriodsOptions: PeriodOption[][];
  workdays: WorkDay[];
  holidays: HolidayViewModel[];
}
