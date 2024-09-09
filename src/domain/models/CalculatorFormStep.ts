import { SelectListViewModel } from "@/domain/models/SelectListViewModel";
import { Nullable } from "primereact/ts-helpers";

export interface CalculatorFormStep {
  validate: () => boolean;
}

interface FormLists {
  states: SelectListViewModel[];
  cities: SelectListViewModel[];
  setStates: (states: SelectListViewModel[]) => void;
  setCities: (cities: SelectListViewModel[]) => void;
}

interface StepPlace {
  selectedState: SelectListViewModel | null;
  selectedCity: SelectListViewModel | null;
  justNational: boolean;
  setSelectedState: (state: SelectListViewModel | null) => void;
  setSelectedCity: (city: SelectListViewModel | null) => void;
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
  lists: FormLists;
  stepPlace: StepPlace;
  stepDaysVacations: StepDaysVacations;
  stepPeriodWorkDays: StepPeriodWorkDays;
}
