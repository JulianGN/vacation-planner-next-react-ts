import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Holiday, HolidayPeriod } from "@/domain/models/Holiday";
import { HolidayService } from "@/infrastructure/services/HolidayService";
import { periodHolidays } from "@/infrastructure/mocks/periodOptionsHolidays";
import { getDiffDays } from "@/utils/date";

const holidayService = new HolidayService();

interface PotentialPeriodsBeginEndings {
  begin: Set<string>;
  end: Set<string>;
}

interface PeriodOption {
  period: HolidayPeriod;
  daysOff: number;
}

export class CalculatorVacationService {
  maxSplitPeriod = 3;
  minPeriodDays = 5;
  minVacationInterval = 30;
  weekDays: WorkDay[] = Object.values(WorkDay).filter(
    (day) => typeof day === "number"
  );
  holidays: Holiday[] = [];
  workdays: WorkDay[] = [];
  notWorkdays: WorkDay[] = [];
  totalDays: number = 0;
  daysSplit: number = 1;
  acceptJumpBridge: boolean = false;

  private filterHolidaysInsideWorkdays(): Holiday[] {
    if (!this.notWorkdays.length) return this.holidays;

    return this.holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      return this.verifyIfDaysIsWorkDay(holidayDate);
    });
  }

  verifyIfDaysIsHoliday(date: Date): boolean {
    return this.holidays.some((holiday) => {
      const currentHolidayDate = new Date(holiday.date);

      return currentHolidayDate.getTime() === date.getTime();
    });
  }

  verifyIfDaysIsWorkDay(date: Date): boolean {
    return this.workdays.includes(date.getDay());
  }

  verifyIfIsNotWorkDay(date: Date): boolean {
    const isHoliday = this.verifyIfDaysIsHoliday(date);
    const isWorkDay = this.verifyIfDaysIsWorkDay(date);

    return isHoliday || !isWorkDay;
  }

  verifyIfIsBridge(date: Date): boolean {
    const dayBefore = new Date(date);
    dayBefore.setDate(date.getDate() - 1);
    const dayBeforeIsNotWorkDay = this.verifyIfIsNotWorkDay(dayBefore);

    const dayAfter = new Date(date);
    dayAfter.setDate(date.getDate() + 1);
    const dayAfterIsNotWorkDay = this.verifyIfIsNotWorkDay(dayAfter);

    return dayBeforeIsNotWorkDay && dayAfterIsNotWorkDay;
  }

  verifyIfDaysIsNotWorkDayOrBridge(date: Date): boolean {
    const isNotWorkDay = this.verifyIfIsNotWorkDay(date);
    const isBridge = this.acceptJumpBridge
      ? this.verifyIfIsBridge(date)
      : false;

    return isNotWorkDay || isBridge;
  }

  getClosestWorkDay(currentDate: Date, before: boolean): Date {
    const date = new Date(currentDate);
    const increment = before ? -1 : 1;

    date.setDate(date.getDate() + increment);

    while (this.verifyIfDaysIsNotWorkDayOrBridge(date)) {
      date.setDate(date.getDate() + increment);
    }

    return date;
  }

  getLastWorkDayBefore(holidayDate: Date): Date {
    return this.getClosestWorkDay(holidayDate, true);
  }

  getFirstWorkDayAfter(holidayDate: Date): Date {
    return this.getClosestWorkDay(holidayDate, false);
  }

  private verifyIfIsGoodBeginDate(holidayDate: Date): boolean {
    const firstWorkDay = this.workdays.at(0);
    const secondWorkday = this.workdays.at(1);
    const lastWorkDay = this.workdays.at(-1);
    const penultimateWorkDay = this.workdays.at(-2);

    const holidayWeekDay = holidayDate.getDay();

    return (
      holidayWeekDay === firstWorkDay ||
      (this.acceptJumpBridge && holidayWeekDay === secondWorkday) ||
      holidayWeekDay === lastWorkDay ||
      (this.acceptJumpBridge && holidayWeekDay === penultimateWorkDay)
    );
  }

  private getPotentialPeriodsBeginEnd(
    holidaysInsideWorkdays: Holiday[]
  ): PotentialPeriodsBeginEndings {
    return holidaysInsideWorkdays.reduce(
      (acc, holiday) => {
        const holidayDate = new Date(holiday.date);

        const firstWorkdayAfter = this.getFirstWorkDayAfter(holidayDate);
        if (this.verifyIfIsGoodBeginDate(holidayDate)) {
          acc.begin.add(firstWorkdayAfter.toISOString());
        }

        const lastWorkdayBefore = this.getLastWorkDayBefore(holidayDate);
        acc.end.add(lastWorkdayBefore.toISOString());

        return acc;
      },
      { begin: new Set(), end: new Set() } as PotentialPeriodsBeginEndings
    );
  }

  private verifyIfPeriodIsInList(period: PeriodOption, list: PeriodOption[]) {
    return list.some(
      (periodOption) =>
        periodOption.period.start.getTime() === period.period.start.getTime() &&
        periodOption.period.end.getTime() === period.period.end.getTime()
    );
  }

  private getOtimizedRate(period: PeriodOption): number {
    return period.daysOff / getDiffDays(period.period.start, period.period.end);
  }

  private getBestPeriods(
    potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings
  ): PeriodOption[] {
    const maxSequencialDays =
      this.totalDays - this.minPeriodDays * (this.daysSplit - 1);

    const accBegin: Set<PeriodOption> = new Set();
    const accEnd: Set<PeriodOption> = new Set();

    potentialPeriodsBeginEndings.begin.forEach((beginDate) => {
      const start = new Date(beginDate);

      potentialPeriodsBeginEndings.end.forEach((endDate) => {
        const end = new Date(endDate);
        if (end.getTime() < start.getTime()) return;

        const diffDays = getDiffDays(start, end);
        if (diffDays < this.minPeriodDays || diffDays > maxSequencialDays)
          return;

        const periodOptionBase = { period: { start, end }, daysOff: 0 };

        if (this.verifyIfPeriodIsInList(periodOptionBase, Array.from(accEnd)))
          return;

        const lastWorkDayBefore = this.getLastWorkDayBefore(start);
        lastWorkDayBefore.setDate(lastWorkDayBefore.getDate() + 1);
        const firstWorkDayAfter = this.getFirstWorkDayAfter(end);
        firstWorkDayAfter.setDate(firstWorkDayAfter.getDate() - 1);
        periodOptionBase.daysOff = getDiffDays(
          lastWorkDayBefore,
          firstWorkDayAfter
        );

        accEnd.add(periodOptionBase);
      });

      if (!accEnd.size) return;

      accEnd.forEach((periodOption) => {
        accBegin.add(periodOption);
      });
    });

    return Array.from(accBegin).sort(
      (a, b) => this.getOtimizedRate(b) - this.getOtimizedRate(a)
    );
  }

  private getBestPeriodsWithoutOverlap(
    periods: PeriodOption[]
  ): PeriodOption[] {
    return periods.reduce((acc, period) => {
      const periodStart = period.period.start;
      const periodEnd = period.period.end;
      const daysOff = period.daysOff;

      const overlappingPeriodIndex = acc.findIndex((accPeriod) => {
        const accPeriodStart = accPeriod.period.start;
        const accPeriodEnd = accPeriod.period.end;
        const accDaysOff = accPeriod.daysOff;

        return (
          periodStart >= accPeriodStart &&
          periodEnd <= accPeriodEnd &&
          daysOff > accDaysOff
        );
      });

      if (overlappingPeriodIndex === -1) {
        acc.push(period);
      } else {
        acc[overlappingPeriodIndex] = period;
      }

      return acc;
    }, [] as PeriodOption[]);
  }

  private getBestPeriodsWithMinimumInterval(
    bestPeriods: PeriodOption[]
  ): PeriodOption[] {
    return bestPeriods.reduce((acc, currentPeriod) => {
      const lastPeriod = acc[acc.length - 1];

      if (!lastPeriod) {
        acc.push(currentPeriod);
        return acc;
      }

      const intervalBetweenPeriods =
        currentPeriod.period.start.getTime() - lastPeriod.period.end.getTime();

      if (intervalBetweenPeriods >= this.minVacationInterval) {
        acc.push(currentPeriod);
      } else if (currentPeriod.daysOff > lastPeriod.daysOff) {
        acc[acc.length - 1] = currentPeriod;
      }

      return acc;
    }, [] as PeriodOption[]);
  }

  private getTotalDaysFromPeriod(periodOptions: PeriodOption[]): number {
    return periodOptions.reduce(
      (sum, period) =>
        sum + getDiffDays(period.period.start, period.period.end),
      0
    );
  }

  private getFillSplitsOptions(
    splits: PeriodOption[][],
    remaining: PeriodOption[]
  ): PeriodOption[][] {
    for (let i = 0; i < this.daysSplit; i++) {
      const currentSplitDays = this.getTotalDaysFromPeriod(splits[i]);

      for (const period of remaining) {
        const newSplitDays = currentSplitDays + period.daysOff;
        if (newSplitDays <= this.totalDays) {
          const newSplits = splits.map((split, index) =>
            index === i ? [...split, period] : split
          );
          const newRemaining = remaining.filter((p) => p !== period);

          return this.getFillSplitsOptions(newSplits, newRemaining);
        }
      }
    }
    return splits;
  }

  private getBestPeriodsSplitOptions(
    bestPeriods: PeriodOption[]
  ): PeriodOption[][] {
    if (this.daysSplit === 1) {
      return bestPeriods.map((period) => [period]);
    }

    const bestPeriod = bestPeriods[0];
    const remainingPeriods = bestPeriods.slice(1);

    const baseSplitPeriodOptions = Array.from(
      { length: this.daysSplit },
      () => [bestPeriod]
    );

    const splitPeriodOptions = this.getFillSplitsOptions(
      baseSplitPeriodOptions,
      remainingPeriods
    );

    return splitPeriodOptions;
  }

  private getPotentialSplitPeriodDays(): number[][] {
    const splitCombinations: number[][] = [];

    if (this.daysSplit === 1) {
      if (this.totalDays >= this.minPeriodDays) {
        return [[this.totalDays]];
      } else {
        throw new Error("Invalid split period");
      }
    }

    const generateSplits = (
      remainingDays: number,
      currentSplit: number,
      currentCombination: number[]
    ) => {
      if (currentSplit === this.daysSplit - 1) {
        if (remainingDays >= this.minPeriodDays) {
          splitCombinations.push([...currentCombination, remainingDays]);
        }
        return;
      }

      for (
        let i = this.minPeriodDays;
        i <= remainingDays - this.minPeriodDays;
        i++
      ) {
        generateSplits(remainingDays - i, currentSplit + 1, [
          ...currentCombination,
          i,
        ]);
      }
    };

    generateSplits(this.totalDays, 0, []);

    return splitCombinations;
  }

  private getPeriodOption(
    date: Date,
    periodDays: number,
    countFromEnd: boolean
  ): PeriodOption {
    const start = new Date(date);
    const end = new Date(date);
    if (countFromEnd) start.setDate(start.getDate() - periodDays);
    else end.setDate(end.getDate() + periodDays);

    const firstNoWorkday = this.getLastWorkDayBefore(start);
    firstNoWorkday.setDate(firstNoWorkday.getDate() + 1);
    const lastDayOff = this.getFirstWorkDayAfter(end);
    lastDayOff.setDate(lastDayOff.getDate() - 1);

    const daysOff = getDiffDays(firstNoWorkday, lastDayOff);

    return { period: { start, end }, daysOff };
  }

  private verifyIfPeriodAfterMinInterval(
    start: Date,
    end: Date,
    usedDates: HolidayPeriod[]
  ) {
    return usedDates.some(
      (date) =>
        getDiffDays(start, date.end) < this.minVacationInterval ||
        getDiffDays(date.start, end) < this.minVacationInterval
    );
  }

  // private getPeriodCombinationsBySplitPeriodOption(
  //   potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings,
  //   periodOptions: number[]
  // ): PeriodOption[] {
  //   const usedDates: HolidayPeriod[] = [];

  //   return periodOptions.map((periodDays) => {
  //     return potentialPeriodsBeginEndings.begin.reduce(
  //       (acc, beginDate, i) => {
  //         const endEquivalent = potentialPeriodsBeginEndings.end[i];

  //         const start = new Date(beginDate);
  //         const end = new Date(endEquivalent);

  //         const dateStartUsed = usedDates.some(
  //           (date) => date.start.getTime() === start.getTime()
  //         );
  //         const dateEndUsed = usedDates.some(
  //           (date) => date.end.getTime() === end.getTime()
  //         );
  //         const lessThanMinVacationInterval = usedDates.length
  //           ? this.verifyIfPeriodAfterMinInterval(start, end, usedDates)
  //           : false;

  //         if (dateStartUsed || dateEndUsed || lessThanMinVacationInterval) {
  //           return acc;
  //         }

  //         const periodOptionFromBegin = this.getPeriodOption(
  //           beginDate,
  //           periodDays,
  //           false
  //         );
  //         const periodOptionFromEnd = this.getPeriodOption(
  //           endEquivalent,
  //           periodDays,
  //           true
  //         );

  //         const betterPeriodOption =
  //           periodOptionFromBegin.daysOff > periodOptionFromEnd.daysOff
  //             ? periodOptionFromBegin
  //             : periodOptionFromEnd;

  //         if (betterPeriodOption.daysOff > acc.daysOff) {
  //           usedDates.push({ start, end });
  //           return betterPeriodOption;
  //         }

  //         return acc;
  //       },
  //       {
  //         daysOff: 0,
  //         period: {},
  //       } as PeriodOption
  //     );
  //   });
  // }

  // private getListOfPeriodCombinationsBySplitPeriodOption(
  //   potentialSplitPeriodDays: number[][],
  //   potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings
  // ) {
  //   if (!potentialSplitPeriodDays.length)
  //     throw new Error("Invalid split period");

  //   return potentialSplitPeriodDays.map((splitPeriod) => {
  //     if (!splitPeriod?.length || splitPeriod.length > this.maxSplitPeriod)
  //       throw new Error("Invalid split period");

  //     const periodCombinations = this.getPeriodCombinationsBySplitPeriodOption(
  //       potentialPeriodsBeginEndings,
  //       splitPeriod
  //     );

  //     if (!periodCombinations.length)
  //       throw new Error("No period combinations found");

  //     return periodCombinations;
  //   });
  // }

  async getVacationPeriodOptions(calculatorPeriodDto: CalculatorPeriodDto) {
    try {
      const {
        period,
        idState,
        idCity,
        workDays,
        daysExtra,
        daysSplit,
        daysVacation,
        acceptJumpBridge,
      } = calculatorPeriodDto;

      const datePeriod = {
        start: new Date(period.start),
        end: new Date(period.end),
      } as HolidayPeriod;
      const numberIdState = !isNaN(Number(idState))
        ? Number(idState)
        : undefined;

      // this.holidays = await holidayService.getHolidaysOrdenedByDate(
      //   datePeriod,
      //   numberIdState,
      //   idCity
      // );
      this.holidays = periodHolidays as Holiday[];
      this.workdays = workDays;
      this.notWorkdays = this.weekDays.filter(
        (day) => !workDays.includes(day)
      ) as WorkDay[];
      this.totalDays = daysVacation + daysExtra;
      this.daysSplit = daysSplit;
      this.acceptJumpBridge = acceptJumpBridge;

      const holidaysInsideWorkdays = this.filterHolidaysInsideWorkdays();

      const potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings =
        this.getPotentialPeriodsBeginEnd(holidaysInsideWorkdays);

      const bestPeriods = potentialPeriodsBeginEndings.begin.size
        ? this.getBestPeriods(potentialPeriodsBeginEndings)
        : [];

      const bestPeriodsNoOverlap = bestPeriods.length
        ? this.getBestPeriodsWithoutOverlap(bestPeriods)
        : [];

      const bestPeriodsWithMinimumInterval = bestPeriodsNoOverlap.length
        ? this.getBestPeriodsWithMinimumInterval(bestPeriodsNoOverlap)
        : [];

      const bestPeriodsSplitOptions = this.getBestPeriodsSplitOptions(
        bestPeriodsWithMinimumInterval
      );

      return {
        holidays: this.holidays,
        bestPeriodsSplitOptions,
      };
    } catch (error) {
      throw error;
    }
  }
}
