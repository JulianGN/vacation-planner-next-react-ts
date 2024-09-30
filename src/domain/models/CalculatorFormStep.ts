import { SelectListViewModel } from "@/domain/models/SelectListViewModel";
import { SelectListGroupByIdViewModel } from "@/domain/models/SelectListGroupByIdViewModel";
import { Nullable } from "primereact/ts-helpers";

export interface CalculatorFormStep {
  validate: () => boolean;
}

interface FormLists {
  states: SelectListViewModel[];
  cities: SelectListGroupByIdViewModel[];
  setStates: (states: SelectListViewModel[]) => void;
  setCities: (cities: SelectListGroupByIdViewModel[]) => void;
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
  acceptJumpBridge: boolean;
  getFullPeriodFromToday: () => Date[];
  setPeriod: (period: Nullable<(Date | null)[]>) => void;
  setFullPeriod: (fullPeriod: boolean) => void;
  setWorkDays: (workDays: number[] | null) => void;
  setAcceptJumpBridge: (acceptJumpBridge: boolean) => void;
}

interface StepFinish {
  periodOptions: string;
  setPeriodOptions: (periodOptions: string) => void;
}

export interface CalculatorState {
  lists: FormLists;
  stepPlace: StepPlace;
  stepDaysVacations: StepDaysVacations;
  stepPeriodWorkDays: StepPeriodWorkDays;
  stepFinish: StepFinish;
}
