import { HolidayPeriod } from "@/domain/models/Holiday";

export interface CalculatorPeriodDto {
  idState?: number;
  idCity?: string;
  daysVaction: number;
  daysSplit: number;
  daysExtra: number;
  period: HolidayPeriod;
  workDays: number[];
  acceptJumpBridge: boolean;
}
