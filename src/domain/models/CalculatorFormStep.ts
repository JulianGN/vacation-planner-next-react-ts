import { State } from "@/domain/models/State";
import { Nullable } from "primereact/ts-helpers";

export interface CalculatorFormStep {
  validate: () => boolean;
}

interface StepPlace {
  selectedState: State | null;
  selectedCity: string | null;
  justNational: boolean;
  setSelectedState: (state: State | null) => void;
  setSelectedCity: (city: string | null) => void;
  setJustNational: (n: boolean) => void;
}

interface StepDaysVacations {
  daysVacation: number;
  daysSplit: number;
  daysExtra: number;
  setDaysVacation: (n: number) => void;
  setDaysSplit: (n: number) => void;
  setDaysExtra: (n: number) => void;
}

interface StepPeriodWorkDays {
  period: Nullable<(Date | null)[]> | null;
  fullPeriod: boolean;
  workDays: number[] | null;
  getFullPeriodFromToday: () => Date[];
  setPeriod: (period: Nullable<(Date | null)[]>) => void;
  setFullPeriod: (fullPeriod: boolean) => void;
  setWorkDays: (workDays: number[] | null) => void;
}

export interface CalculatorState {
  stepPlace: StepPlace;
  stepDaysVacations: StepDaysVacations;
  stepPeriodWorkDays: StepPeriodWorkDays;
}
