import { WorkDay } from "@/domain/enums/WorkDay";
import { PeriodOption } from "@/domain/models/CalculatorVacation";

export interface CalculatorVacationResponseViewModel {
  bestPeriodsOptions: PeriodOption[][];
  workdays: WorkDay[];
  holidays: Date[];
}
