import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Holiday, Period } from "@/domain/models/Holiday";
import { HolidayService } from "@/infrastructure/services/HolidayService";
// import { periodHolidays } from "@/infrastructure/mocks/periodOptionsHolidays";
import { getDiffDays } from "@/utils/date";
import {
  maxSplitPeriod,
  minPeriodDays,
  minPeriodForAtLeastOneWhenSplit,
  minVacationInterval,
  weekDays,
} from "@/utils/consts/calculatorVacation";
import { CalculatorVacationResponseViewModel } from "@/domain/models/CalculatorVacationResponseViewModel";
import { PeriodOption } from "@/domain/models/CalculatorVacation";

const holidayService = new HolidayService();

interface PotentialPeriodsBeginEndings {
  begin: Set<string>;
  end: Set<string>;
}

export class CalculatorVacationService {
  holidays: Holiday[] = [];
  workdays: WorkDay[] = [];
  lastWorkdayForBegin: WorkDay = WorkDay.thursday; // this will be updated after workdays are set
  notWorkdays: WorkDay[] = [];
  totalDays: number = 0;
  daysSplit: number = 1;
  acceptJumpBridge: boolean = false;

  private getRangeWorkDays(workDays: WorkDay[]): WorkDay[] {
    const firstWorkDay = workDays[0];
    const lastWorkDay = workDays.at(-1);
    if (!lastWorkDay) return [];

    return weekDays.reduce((acc, day) => {
      if (day >= firstWorkDay && day <= lastWorkDay) {
        acc.push(day);
      }

      return acc;
    }, [] as WorkDay[]);
  }

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

  private verifyIfIsNotWorkDay(date: Date): boolean {
    const isHoliday = this.verifyIfDaysIsHoliday(date);
    const isWorkDay = this.verifyIfDaysIsWorkDay(date);

    return isHoliday || !isWorkDay;
  }

  private verifyIfIsBridge(date: Date): boolean {
    const dayBefore = new Date(date);
    dayBefore.setDate(date.getDate() - 1);
    const dayBeforeIsNotWorkDay = this.verifyIfIsNotWorkDay(dayBefore);

    const dayAfter = new Date(date);
    dayAfter.setDate(date.getDate() + 1);
    const dayAfterIsNotWorkDay = this.verifyIfIsNotWorkDay(dayAfter);

    return dayBeforeIsNotWorkDay && dayAfterIsNotWorkDay;
  }

  private verifyIfDaysIsNotWorkDayOrBridge(date: Date): boolean {
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

  private getLastWorkDayBefore(holidayDate: Date): Date {
    return this.getClosestWorkDay(holidayDate, true);
  }

  private getFirstWorkDayAfter(holidayDate: Date): Date {
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

  private verifyIfPeriodsHaveMinimumInterval(periods: PeriodOption[]): boolean {
    return periods.every((period, index) => {
      const nextPeriod = periods[index + 1];
      if (!nextPeriod) return true;

      const intervalBetweenPeriods =
        nextPeriod.period.start.getTime() - period.period.end.getTime();

      return intervalBetweenPeriods >= minVacationInterval;
    });
  }

  private verifyIfSomePeriodHasMinPeriodForOneWhenSplit(
    periods: PeriodOption[]
  ): boolean {
    return periods.some(
      (period) => period.daysUsed >= minPeriodForAtLeastOneWhenSplit
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

  private getOtimizedRate(period: PeriodOption): number {
    return (
      ((period.daysOff - period.daysUsed) * period.daysOff) / period.daysUsed
    );
  }

  private getPeriodOption(periodOptionBase: PeriodOption): PeriodOption {
    const { period } = periodOptionBase;
    const { start, end } = period;

    const lastWorkDayBefore = this.getLastWorkDayBefore(start);
    lastWorkDayBefore.setDate(lastWorkDayBefore.getDate() + 1);
    const firstWorkDayAfter = this.getFirstWorkDayAfter(end);
    firstWorkDayAfter.setDate(firstWorkDayAfter.getDate() - 1);
    periodOptionBase.daysUsed = getDiffDays(start, end);
    // TODO: Check why the period 2025-03-05T03:00:00.000Z - 2025-03-20T03:00:00.000Z shows 20 as daysOff but should be 23
    periodOptionBase.daysOff = getDiffDays(
      lastWorkDayBefore,
      firstWorkDayAfter
    );

    return periodOptionBase;
  }

  private getTotalDaysUsedFromPeriods(periodOptions: PeriodOption[]): number {
    return periodOptions.reduce((sum, period) => sum + period.daysUsed, 0);
  }

  private getTotalDaysOffFromPeriods(periodOptions: PeriodOption[]): number {
    return periodOptions.reduce((sum, period) => sum + period.daysOff, 0);
  }

  private getAllPeriodsFromBegin(
    beginSetList: Set<string>,
    maxSequencialDays: number
  ): PeriodOption[] {
    const periodsFromBegin: PeriodOption[] = [];

    beginSetList.forEach((beginDate) => {
      const start = new Date(beginDate);

      for (let days = minPeriodDays; days <= maxSequencialDays; days++) {
        const end = new Date(start);
        end.setDate(end.getDate() + days - 1);

        const periodOptionBase = {
          period: { start, end },
          daysUsed: 0,
          daysOff: 0,
        };

        const periodOption = this.getPeriodOption(periodOptionBase);
        periodsFromBegin.push(periodOption);
      }
    });

    return periodsFromBegin;
  }

  private getAllPeriodsFromEnd(
    endSetList: Set<string>,
    maxSequencialDays: number
  ): PeriodOption[] {
    const periodsFromEnd: PeriodOption[] = [];

    endSetList.forEach((endDate) => {
      const end = new Date(endDate);

      for (let days = minPeriodDays; days <= maxSequencialDays; days++) {
        const start = new Date(end);
        start.setDate(start.getDate() - days + 1);

        if (start.getDay() < this.lastWorkdayForBegin) continue;

        const periodOptionBase = {
          period: { start, end },
          daysUsed: 0,
          daysOff: 0,
        };

        const periodOption = this.getPeriodOption(periodOptionBase);
        periodsFromEnd.push(periodOption);
      }
    });

    return periodsFromEnd;
  }

  // TODO: Endpoint to get best period to replace another with the same number of days
  private getBestPeriodPeriodFromBeginAndDaysUsed(
    datesToBegin: Set<string>,
    daysToUse: number
  ): PeriodOption[] {
    const allPeriodsFromBegin: PeriodOption[] = [];

    datesToBegin.forEach((beginDate) => {
      const start = new Date(beginDate);

      const end = new Date(start);
      end.setDate(end.getDate() + daysToUse - 1);

      const periodOptionBase = {
        period: { start, end },
        daysUsed: 0,
        daysOff: 0,
      };

      return this.getPeriodOption(periodOptionBase);
    });

    const allPeriodsSorted = allPeriodsFromBegin.sort(
      (a, b) => this.getOtimizedRate(b) - this.getOtimizedRate(a)
    );

    return allPeriodsSorted.slice(0, 5);
  }

  private getAllGoodPeriodsOptions(
    potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings
  ): PeriodOption[] {
    const maxSequencialDays =
      this.totalDays - minPeriodDays * (this.daysSplit - 1);

    const periodsFromBegin = this.getAllPeriodsFromBegin(
      potentialPeriodsBeginEndings.begin,
      maxSequencialDays
    );
    const periodsFromEnd = this.getAllPeriodsFromEnd(
      potentialPeriodsBeginEndings.end,
      maxSequencialDays
    );

    const allPeriodOptions = [...periodsFromBegin, ...periodsFromEnd].sort(
      (a, b) => this.getOtimizedRate(b) - this.getOtimizedRate(a)
    );

    return allPeriodOptions;
  }

  private getAllBestSplitPeriodsOptions(
    allGoodPeriodsOptions: PeriodOption[]
  ): PeriodOption[][] {
    return allGoodPeriodsOptions.reduce((acc, periodOption) => {
      const periodStart = periodOption.period.start;
      let splitUsed = 1;

      let splitGroup: PeriodOption[] = [periodOption];

      for (let i = 0; i < allGoodPeriodsOptions.length; i++) {
        const periodOptionToCompare = allGoodPeriodsOptions[i];

        if (splitUsed >= this.daysSplit) break;

        const periodToCompareStart = periodOptionToCompare.period.start;

        if (
          JSON.stringify(periodOptionToCompare) ===
            JSON.stringify(periodOption) ||
          periodStart >= periodToCompareStart ||
          !this.verifyIfPeriodsHaveMinimumInterval([
            periodOption,
            periodOptionToCompare,
          ])
        ) {
          continue;
        }

        const futureSplitGroup = [...splitGroup, periodOptionToCompare];

        if (
          this.getTotalDaysUsedFromPeriods(futureSplitGroup) > this.totalDays
        ) {
          continue;
        }

        if (
          this.daysSplit === maxSplitPeriod &&
          !this.verifyIfSomePeriodHasMinPeriodForOneWhenSplit(
            futureSplitGroup
          ) &&
          periodOptionToCompare.daysUsed < minPeriodForAtLeastOneWhenSplit
        ) {
          continue;
        }

        splitGroup = futureSplitGroup;
        splitUsed++;
      }

      if (splitGroup.length === this.daysSplit) {
        acc.push(splitGroup);
      }
      return acc;
    }, [] as PeriodOption[][]);
  }

  private getBestPeriodOptions(
    allGoodPeriodsOptions: PeriodOption[]
  ): PeriodOption[][] {
    const allBestSplitPeriodsOptions = this.getAllBestSplitPeriodsOptions(
      allGoodPeriodsOptions
    );
    const allBestSplitPeriodsOptionsSorted = allBestSplitPeriodsOptions
      .sort(
        (a, b) =>
          this.getTotalDaysOffFromPeriods(b) -
          this.getTotalDaysOffFromPeriods(a)
      )
      .slice(0, 10);

    return allBestSplitPeriodsOptionsSorted;
  }

  async getVacationPeriodOptions(
    calculatorPeriodDto: CalculatorPeriodDto
  ): Promise<CalculatorVacationResponseViewModel> {
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
      } as Period;
      const numberIdState = !isNaN(Number(idState))
        ? Number(idState)
        : undefined;

      this.holidays = await holidayService.getHolidaysOrdenedByDate(
        datePeriod,
        numberIdState,
        idCity
      );
      // this.holidays = periodHolidays as Holiday[];
      this.workdays = this.getRangeWorkDays(workDays);
      this.lastWorkdayForBegin = this.workdays.at(-3) ?? WorkDay.wednesday;
      this.notWorkdays = weekDays.filter(
        (day) => !this.workdays.includes(day)
      ) as WorkDay[];
      this.totalDays = daysVacation + daysExtra;
      this.daysSplit = daysSplit;
      this.acceptJumpBridge = acceptJumpBridge;

      const holidaysInsideWorkdays = this.filterHolidaysInsideWorkdays();

      const potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings =
        this.getPotentialPeriodsBeginEnd(holidaysInsideWorkdays);

      const allPeriodOptions = this.getAllGoodPeriodsOptions(
        potentialPeriodsBeginEndings
      );

      const bestPeriodsOptions = this.getBestPeriodOptions(allPeriodOptions);

      return {
        bestPeriodsOptions,
        workdays: this.workdays,
        holidays: this.holidays.map((holiday) => holiday.date),
      };
    } catch (error) {
      throw error;
    }
  }
}
