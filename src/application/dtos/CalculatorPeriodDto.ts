import { Period } from "@/domain/models/CalculatorVacation";

export interface CalculatorPeriodDto {
  idState?: number;
  idCity?: string;
  daysVacation: number;
  daysSplit: number;
  daysExtra: number;
  period: Period;
  workDays: number[];
  acceptJumpBridge: boolean;
}
