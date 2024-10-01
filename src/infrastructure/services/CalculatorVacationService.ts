import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Holiday, HolidayPeriod } from "@/domain/models/Holiday";
import { HolidayService } from "@/infrastructure/services/HolidayService";
import { periodHolidays } from "@/infrastructure/mocks/periodOptionsHolidays";
import { getDiffDays } from "@/utils/date";

const holidayService = new HolidayService();

interface PotentialPeriodsBeginEndings {
  begin: Date[];
  end: Date[];
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
  acceptJumpBridge: boolean = false;

  private filterHolidaysInsideWorkdays(): Holiday[] {
    if (!this.notWorkdays.length) return this.holidays;

    return this.holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      return this.verifyIfDaysIsWorkDay(holidayDate);
    });
  }

  private filterPotentialBridgesHolidays(
    holidaysInsideWorkdays: Holiday[]
  ): Holiday[] {
    if (!this.notWorkdays.length) return holidaysInsideWorkdays;
    const potentialBridges = holidaysInsideWorkdays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      const dayOfWeek = holidayDate.getDay();
      const hasBridge = this.notWorkdays.some((notWorkday) => {
        const distanceToNonWorkday = Math.abs(dayOfWeek - notWorkday);
        return distanceToNonWorkday <= 1 + Number(this.acceptJumpBridge);
      });

      return hasBridge;
    });

    return potentialBridges;
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

  getClosestWorkDay(holidayDate: Date, before: boolean): Date {
    const date = new Date(holidayDate);
    const increment = before ? -1 : 1;

    date.setDate(date.getDate() + increment);

    while (!this.verifyIfDaysIsWorkDay(date)) {
      date.setDate(date.getDate() + increment);
    }

    if (this.verifyIfDaysIsHoliday(date)) {
      if (this.acceptJumpBridge) {
        if (before) {
          const coupleDaysBefore = new Date(date);
          coupleDaysBefore.setDate(coupleDaysBefore.getDate() - 1);
          if (this.verifyIfDaysIsHoliday(coupleDaysBefore)) {
            return this.getClosestWorkDay(coupleDaysBefore, before);
          }
          if (this.verifyIfDaysIsWorkDay(coupleDaysBefore)) {
            return coupleDaysBefore;
          }
        }

        if (!before) {
          const coupleDaysAfter = new Date(date);
          coupleDaysAfter.setDate(coupleDaysAfter.getDate() + 1);
          if (this.verifyIfDaysIsHoliday(coupleDaysAfter)) {
            return this.getClosestWorkDay(coupleDaysAfter, before);
          }
          if (this.verifyIfDaysIsWorkDay(coupleDaysAfter)) {
            return coupleDaysAfter;
          }
        }
      }

      return this.getClosestWorkDay(date, before);
    }

    return date;
  }

  getLastWorkDayBefore(holidayDate: Date): Date {
    return this.getClosestWorkDay(holidayDate, true);
  }

  getFirstWorkDayAfter(holidayDate: Date): Date {
    return this.getClosestWorkDay(holidayDate, false);
  }

  private getPotentialPeriodsBeginEnd(
    potentialBridges: Holiday[]
  ): PotentialPeriodsBeginEndings {
    const firstWorkday = this.workdays[0];
    const lastWorkday = this.workdays.at(-1);

    return potentialBridges.reduce(
      (acc, holiday) => {
        const holidayDate = new Date(holiday.date);
        const dayOfWeek = holidayDate.getDay();

        if (
          dayOfWeek === firstWorkday ||
          dayOfWeek - Number(this.acceptJumpBridge) === firstWorkday
        ) {
          acc.begin.push(this.getFirstWorkDayAfter(holidayDate));
          acc.end.push(this.getLastWorkDayBefore(holidayDate));
        }

        if (
          dayOfWeek === lastWorkday ||
          dayOfWeek + Number(this.acceptJumpBridge) === lastWorkday
        ) {
          acc.begin.push(this.getFirstWorkDayAfter(holidayDate));
          acc.end.push(this.getLastWorkDayBefore(holidayDate));
        }

        return acc;
      },
      { begin: [], end: [] } as PotentialPeriodsBeginEndings
    );
  }

  private verifyIfPeriodIsInList(period: PeriodOption, list: PeriodOption[]) {
    return list.some(
      (periodOption) =>
        periodOption.period.start.getTime() === period.period.start.getTime() &&
        periodOption.period.end.getTime() === period.period.end.getTime()
    );
  }

  private getBestPeriods(
    potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings,
    daysSplit: number
  ): PeriodOption[] {
    const maxSequencialDays =
      this.totalDays - this.minPeriodDays * (daysSplit - 1);

    return potentialPeriodsBeginEndings.begin.reduce((acc, beginDate) => {
      const start = new Date(beginDate);
      const listClosestEndAfter = potentialPeriodsBeginEndings.end.reduce(
        (accEnd, endDate) => {
          const end = new Date(endDate);
          if (end.getTime() < start.getTime()) return accEnd;

          const diffDays = getDiffDays(start, end);
          if (diffDays < this.minPeriodDays || diffDays > maxSequencialDays)
            return accEnd;

          const periodOptionBase = { period: { start, end }, daysOff: 0 };

          if (this.verifyIfPeriodIsInList(periodOptionBase, acc)) return accEnd;

          const lastWorkDayBefore = this.getLastWorkDayBefore(start);
          lastWorkDayBefore.setDate(lastWorkDayBefore.getDate() + 1);
          const firstWorkDayAfter = this.getFirstWorkDayAfter(end);
          firstWorkDayAfter.setDate(firstWorkDayAfter.getDate() - 1);
          periodOptionBase.daysOff = getDiffDays(
            lastWorkDayBefore,
            firstWorkDayAfter
          );

          accEnd.push(periodOptionBase);

          return accEnd;
        },
        [] as PeriodOption[]
      );

      if (!listClosestEndAfter.length) return acc;

      acc.push(...listClosestEndAfter);

      return acc;
    }, [] as PeriodOption[]);
  }

  private getPotentialSplitPeriodDays(daysSplit: number): number[][] {
    const splitCombinations: number[][] = [];

    if (daysSplit === 1) {
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
      if (currentSplit === daysSplit - 1) {
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

  private getPeriodCombinationsBySplitPeriodOption(
    potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings,
    periodOptions: number[]
  ): PeriodOption[] {
    const usedDates: HolidayPeriod[] = [];

    return periodOptions.map((periodDays) => {
      return potentialPeriodsBeginEndings.begin.reduce(
        (acc, beginDate, i) => {
          const endEquivalent = potentialPeriodsBeginEndings.end[i];

          const start = new Date(beginDate);
          const end = new Date(endEquivalent);

          const dateStartUsed = usedDates.some(
            (date) => date.start.getTime() === start.getTime()
          );
          const dateEndUsed = usedDates.some(
            (date) => date.end.getTime() === end.getTime()
          );
          const lessThanMinVacationInterval = usedDates.length
            ? this.verifyIfPeriodAfterMinInterval(start, end, usedDates)
            : false;

          if (dateStartUsed || dateEndUsed || lessThanMinVacationInterval) {
            return acc;
          }

          const periodOptionFromBegin = this.getPeriodOption(
            beginDate,
            periodDays,
            false
          );
          const periodOptionFromEnd = this.getPeriodOption(
            endEquivalent,
            periodDays,
            true
          );

          const betterPeriodOption =
            periodOptionFromBegin.daysOff > periodOptionFromEnd.daysOff
              ? periodOptionFromBegin
              : periodOptionFromEnd;

          if (betterPeriodOption.daysOff > acc.daysOff) {
            usedDates.push({ start, end });
            return betterPeriodOption;
          }

          return acc;
        },
        {
          daysOff: 0,
          period: {},
        } as PeriodOption
      );
    });
  }

  private getListOfPeriodCombinationsBySplitPeriodOption(
    potentialSplitPeriodDays: number[][],
    potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings
  ) {
    if (!potentialSplitPeriodDays.length)
      throw new Error("Invalid split period");

    return potentialSplitPeriodDays.map((splitPeriod) => {
      if (!splitPeriod?.length || splitPeriod.length > this.maxSplitPeriod)
        throw new Error("Invalid split period");

      const periodCombinations = this.getPeriodCombinationsBySplitPeriodOption(
        potentialPeriodsBeginEndings,
        splitPeriod
      );

      if (!periodCombinations.length)
        throw new Error("No period combinations found");

      return periodCombinations;
    });
  }

  async getVacationPeriodOptions(calculatorPeriodDto: CalculatorPeriodDto) {
    try {
      const {
        period,
        idState,
        idCity,
        workDays,
        daysExtra,
        daysSplit,
        daysVaction,
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
      this.totalDays = daysVaction + daysExtra;
      this.acceptJumpBridge = acceptJumpBridge;

      const holidaysInsideWorkdays = this.filterHolidaysInsideWorkdays();

      const potentialBridges = this.filterPotentialBridgesHolidays(
        holidaysInsideWorkdays
      );

      const potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings =
        this.getPotentialPeriodsBeginEnd(potentialBridges);

      const bestPeriods = this.getBestPeriods(
        potentialPeriodsBeginEndings,
        daysSplit
      );

      const potentialSplitPeriodDays: number[][] =
        this.getPotentialSplitPeriodDays(daysSplit);

      const periodCombinationsBySplitPeriodOption: PeriodOption[][] =
        this.getListOfPeriodCombinationsBySplitPeriodOption(
          potentialSplitPeriodDays,
          potentialPeriodsBeginEndings
        );

      return {
        holidays: this.holidays,
        potentialBridges,
        bestPeriods,
      };
    } catch (error) {
      throw error;
    }
  }
}
