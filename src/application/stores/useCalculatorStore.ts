import { WorkDay } from "@/domain/enums/WorkDay";
import { itemsWorkDays } from "@/domain/models/WorkDay";
import { CalculatorState } from "@/domain/models/CalculatorFormStep";
import { create } from "zustand";
import { produce } from "immer";
import { CalculatorVacationResponseViewModel } from "@/domain/models/CalculatorVacationResponseViewModel";

const useCalculatorStore = create<CalculatorState>((set) => {
  function getFullPeriodFromToday(): Date[] {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setMonth(today.getMonth() + 12);

    return [today, nextYear];
  }

  function getInitialWorkDays(): number[] {
    const notWorkDay = [WorkDay.saturday, WorkDay.sunday];
    const initialWorkDays = itemsWorkDays.reduce((acc, item) => {
      if (!notWorkDay.includes(item.value)) {
        acc.push(item.value);
      }
      return acc;
    }, [] as number[]);

    return initialWorkDays;
  }

  return {
    lists: {
      states: [],
      cities: [],
      setStates: (states) =>
        set(
          produce((state) => {
            state.lists.states = states;
          })
        ),
      setCities: (cities) =>
        set(
          produce((state) => {
            state.lists.cities = cities;
          })
        ),
    },
    stepPlace: {
      selectedState: null,
      selectedCity: null,
      justNational: false,
      setSelectedState: (selectedState) =>
        set(
          produce((state) => {
            state.stepPlace.selectedState = selectedState;
          })
        ),
      setSelectedCity: (selectedCity) =>
        set(
          produce((state) => {
            state.stepPlace.selectedCity = selectedCity;
          })
        ),
      setJustNational: (justNational) =>
        set(
          produce((state) => {
            state.stepPlace.justNational = justNational;
          })
        ),
    },
    stepDaysVacations: {
      daysVacation: 30,
      validDaysVacation: true,
      daysSplit: 3,
      validDaysSplit: true,
      daysExtra: 0,
      setDaysVacation: (daysVacation) =>
        set(
          produce((state) => {
            state.stepDaysVacations.daysVacation = daysVacation;
          })
        ),
      setValidDaysSplit: (validDaysSplit) =>
        set(
          produce((state) => {
            state.stepDaysVacations.validDaysSplit = validDaysSplit;
          })
        ),
      setDaysSplit: (daysSplit) =>
        set(
          produce((state) => {
            state.stepDaysVacations.daysSplit = daysSplit;
          })
        ),
      setValidDaysVacation: (validDaysVacation) =>
        set(
          produce((state) => {
            state.stepDaysVacations.validDaysVacation = validDaysVacation;
          })
        ),
      setDaysExtra: (daysExtra) =>
        set(
          produce((state) => {
            state.stepDaysVacations.daysExtra = daysExtra;
          })
        ),
    },
    stepPeriodWorkDays: {
      period: getFullPeriodFromToday(),
      fullPeriod: true,
      workDays: getInitialWorkDays(),
      acceptJumpBridge: true,
      getFullPeriodFromToday,
      setPeriod: (period) =>
        set(
          produce((state) => {
            state.stepPeriodWorkDays.period = period;
          })
        ),
      setFullPeriod: (fullPeriod) =>
        set(
          produce((state) => {
            state.stepPeriodWorkDays.fullPeriod = fullPeriod;
          })
        ),
      setWorkDays: (workDays) =>
        set(
          produce((state) => {
            state.stepPeriodWorkDays.workDays = workDays;
          })
        ),
      setAcceptJumpBridge: (acceptJumpBridge) =>
        set(
          produce((state) => {
            state.stepPeriodWorkDays.acceptJumpBridge = acceptJumpBridge;
          })
        ),
    },
    stepFinish: {
      periodOptions: {} as CalculatorVacationResponseViewModel,
      setPeriodOptions: (
        calculatorVacationResponseViewModel: CalculatorVacationResponseViewModel
      ) =>
        set(
          produce((state) => {
            state.stepFinish.calculatorVacationResponseViewModel =
              calculatorVacationResponseViewModel;
          })
        ),
    },
  };
});

export default useCalculatorStore;
