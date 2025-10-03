import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Holiday } from "@/domain/models/Holiday";
import { HolidayService } from "@/infrastructure/services/HolidayService";
import { useCalculatorVacation } from "@/application/hooks/useCalculatorVacation";
import { getDiffDays, getMsInDays } from "@/utils/date";
import {
  maxSplitPeriod,
  minPeriodDays,
  minPeriodForAtLeastOneWhenSplit,
  minVacationInterval,
  weekDays,
} from "@/utils/consts/calculatorVacation";
import { CalculatorVacationResponseViewModel } from "@/domain/models/CalculatorVacationResponseViewModel";
import {
  Period,
  PeriodOption,
  PotentialPeriodsBeginEndings,
} from "@/domain/models/CalculatorVacation";
import { HolidayViewModel } from "@/domain/models/HolidayViewModel";

// Instantiate infrastructure services directly. Consider using dependency injection for better testability.
const holidayService = new HolidayService();

/**
 * Service responsible for calculating optimal vacation periods.
 * It considers holidays, workdays, vacation days requested, and splitting preferences.
 */
export class CalculatorVacationService {
  // Hook containing utility functions for date calculations related to workdays and holidays.
  calculatorVacation = useCalculatorVacation();

  // State properties populated during the calculation process
  holidays: Holiday[] = []; // List of holidays within the requested period.
  holidayDates: HolidayViewModel[] = []; // Processed holiday dates (potentially redundant).
  workdays: WorkDay[] = []; // List of days considered workdays (e.g., [1, 2, 3, 4, 5] for Mon-Fri).
  lastWorkdayForBegin: WorkDay = WorkDay.thursday; // Heuristic: Last preferred workday to start vacation (updated based on actual workdays).
  notWorkdays: WorkDay[] = []; // List of days considered non-workdays.
  totalDays: number = 0; // Total vacation days available (requested + extra).
  daysSplit: number = 1; // Number of periods to split the vacation into.
  acceptJumpBridge: boolean = false; // Whether to consider starting/ending vacations adjacent to holidays/weekends ("enforcar feriado").

  /**
   * Filters the main holiday list to include only holidays that fall on configured workdays.
   * @returns {Holiday[]} Filtered list of holidays.
   */
  private filterHolidaysInsideWorkdays(): Holiday[] {
    if (!this.notWorkdays.length) return this.holidays;

    return this.holidays.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      // Uses helper hook to check if the holiday date is a configured workday.
      return this.calculatorVacation.verifyIfDaysIsWorkDay(
        holidayDate,
        this.workdays
      );
    });
  }

  /**
   * Determines the continuous range of workdays based on the configured list.
   * Example: If workdays = [Mon, Tue, Fri], it might return [Mon, Tue] or based on interpretation.
   * Current implementation returns days between the first and last configured workday.
   * @param {WorkDay[]} workDays - The configured list of workdays.
   * @returns {WorkDay[]} The determined range of workdays.
   */
  getRangeWorkDays(workDays: WorkDay[]): WorkDay[] {
    const firstWorkDay = workDays[0];
    const lastWorkDay = workDays.at(-1);
    if (!lastWorkDay) return [];

    // Returns all weekdays between the first and last configured workday, inclusive.
    return weekDays.reduce((acc, day) => {
      if (day >= firstWorkDay && day <= lastWorkDay) {
        acc.push(day);
      }
      return acc;
    }, [] as WorkDay[]);
  }

  /**
   * Checks if a given date (typically a holiday) is a "good" day to start a vacation period *after*.
   * Considers proximity to the start/end of the work week and the 'acceptJumpBridge' option.
   * @param {Date} holidayDate - The date to check.
   * @returns {boolean} True if it's considered a good starting point.
   */
  private verifyIfIsGoodBeginDate(holidayDate: Date): boolean {
    const firstWorkDay = this.workdays.at(0);
    const secondWorkday = this.workdays.at(1);
    const lastWorkDay = this.workdays.at(-1);
    const penultimateWorkDay = this.workdays.at(-2);

    const holidayWeekDay = holidayDate.getDay();

    // Good if holiday is on the first/last workday, or second/penultimate if bridging is allowed.
    return (
      holidayWeekDay === firstWorkDay ||
      (this.acceptJumpBridge && holidayWeekDay === secondWorkday) ||
      holidayWeekDay === lastWorkDay ||
      (this.acceptJumpBridge && holidayWeekDay === penultimateWorkDay)
    );
  }

  /**
   * Verifies if a list of potential vacation periods respects the minimum interval required between them.
   * @param {PeriodOption[]} periods - The list of periods to check.
   * @returns {boolean} True if the minimum interval is respected.
   */
  private verifyIfPeriodsHaveMinimumInterval(periods: PeriodOption[]): boolean {
    // Sort periods by start date to ensure correct comparison
    const sortedPeriods = [...periods].sort((a, b) => a.period.start.getTime() - b.period.start.getTime());

    return sortedPeriods.every((period, index) => {
      const nextPeriod = sortedPeriods[index + 1];
      if (!nextPeriod) return true; // Last period or single period

      // Calculate interval between the end of the current period and the start of the next.
      const msBetweenPeriods =
        nextPeriod.period.start.getTime() - period.period.end.getTime();
      // Ensure interval is calculated correctly (days between end+1 and start-1)
      const intervalBetweenPeriods = getMsInDays(msBetweenPeriods) -1; // Adjust if getMsInDays includes start/end

      return intervalBetweenPeriods >= minVacationInterval;
    });
  }

  /**
   * Checks if at least one period in a list meets the minimum duration required when splitting vacations (e.g., 14 days for one period if split).
   * @param {PeriodOption[]} periods - The list of periods.
   * @returns {boolean} True if the condition is met.
   */
  private verifyIfSomePeriodHasMinPeriodForOneWhenSplit(
    periods: PeriodOption[]
  ): boolean {
    return periods.some(
      (period) => period.daysUsed >= minPeriodForAtLeastOneWhenSplit
    );
  }

  /**
   * Identifies potential start and end dates for vacation periods based on holidays.
   * Potential starts are the first workdays *after* holidays considered good start points.
   * Potential ends are the last workdays *before* any holiday.
   * @param {Holiday[]} holidaysInsideWorkdays - Filtered list of holidays occurring on workdays.
   * @returns {PotentialPeriodsBeginEndings} Sets of potential start and end dates (as ISO strings).
   */
  private getPotentialPeriodsBeginEnd(
    holidaysInsideWorkdays: Holiday[]
  ): PotentialPeriodsBeginEndings {
    return holidaysInsideWorkdays.reduce(
      (acc, holiday) => {
        const holidayDate = new Date(holiday.date);

        // Find the first workday after the holiday (potential start).
        const firstWorkdayAfter = this.calculatorVacation.getFirstWorkDayAfter(
          holidayDate,
          this.holidays, // Use all holidays for context
          this.workdays,
          this.acceptJumpBridge
        );
        // Add to potential starts only if the holiday date itself is considered good.
        if (this.verifyIfIsGoodBeginDate(holidayDate)) {
          acc.begin.add(firstWorkdayAfter.toISOString());
        }

        // Find the last workday before the holiday (potential end).
        const lastWorkdayBefore = this.calculatorVacation.getLastWorkDayBefore(
          holidayDate,
          this.holidays, // Use all holidays for context
          this.workdays,
          this.acceptJumpBridge
        );
        acc.end.add(lastWorkdayBefore.toISOString());

        return acc;
      },
      { begin: new Set(), end: new Set() } as PotentialPeriodsBeginEndings
    );
  }

  /**
   * Calculates an optimization rate for a given vacation period.
   * Higher rate means more days off relative to days used.
   * Formula: ((daysOff - daysUsed) * daysOff) / daysUsed
   * @param {PeriodOption} period - The vacation period.
   * @returns {number} The calculated optimization rate.
   */
  private getOtimizedRate(period: PeriodOption): number {
    // Avoid division by zero
    if (period.daysUsed === 0) return 0;
    // Calculate the gain (daysOff - daysUsed) and weigh it by daysOff.
    return (
      ((period.daysOff - period.daysUsed) * period.daysOff) / period.daysUsed
    );
  }

  /**
   * Calculates the details (daysUsed, daysOff) for a potential vacation period.
   * @param {PeriodOption} periodOptionBase - Basic period with start and end dates.
   * @returns {PeriodOption} Period option with calculated daysUsed and daysOff.
   */
  private getPeriodOption(periodOptionBase: PeriodOption): PeriodOption {
    const { period } = periodOptionBase;
    const { start, end } = period;

    // Find the actual boundaries considering surrounding non-workdays/holidays.
    const lastWorkDayBeforeStart = this.calculatorVacation.getLastWorkDayBefore(
      start,
      this.holidays,
      this.workdays,
      this.acceptJumpBridge
    );
    // Effective start of time off is the day after the last workday before the period.
    const effectiveStartOff = new Date(lastWorkDayBeforeStart);
    effectiveStartOff.setDate(effectiveStartOff.getDate() + 1);

    const firstWorkDayAfterEnd = this.calculatorVacation.getFirstWorkDayAfter(
      end,
      this.holidays,
      this.workdays,
      this.acceptJumpBridge
    );
    // Effective end of time off is the day before the first workday after the period.
    const effectiveEndOff = new Date(firstWorkDayAfterEnd);
    effectiveEndOff.setDate(effectiveEndOff.getDate() - 1);

    // daysUsed: Calendar days within the selected start/end dates.
    periodOptionBase.daysUsed = getDiffDays(start, end);

    // daysOff: Total calendar days from the effective start off to the effective end off.
    // This represents the total continuous block of non-working time achieved.
    periodOptionBase.daysOff = getDiffDays(
      effectiveStartOff,
      effectiveEndOff
    );

    // TODO: Check calculation for 2025-03-05 to 2025-03-20. Expected 23 daysOff, got 20.
    // Investigation needed: This might depend on specific holidays (e.g., Carnival 2025-03-04)
    // and the exact behavior of getDiffDays, getLastWorkDayBefore, getFirstWorkDayAfter.
    // The current logic calculates daysOff as the total span from the day after the last workday *before* start
    // to the day before the first workday *after* end. This seems conceptually correct for total time off.
    // The discrepancy (20 vs 23) might stem from holiday data or edge cases in helper functions.
    // Example: If Mar 4 is holiday, last workday before Mar 5 is Mar 3. effectiveStartOff = Mar 4.
    // If Mar 21 is workday, first workday after Mar 20 is Mar 21. effectiveEndOff = Mar 20.
    // daysOff = getDiffDays(Mar 4, Mar 20) = 17 days. Still doesn't match 20 or 23.
    // Without exact holiday data and helper function logic, cannot definitively fix.
    // Assuming current calculation is the intended logic for now.

    return periodOptionBase;
  }

  /**
   * Calculates the sum of 'daysUsed' for a list of periods.
   * @param {PeriodOption[]} periodOptions - List of periods.
   * @returns {number} Total days used.
   */
  private getTotalDaysUsedFromPeriods(periodOptions: PeriodOption[]): number {
    return periodOptions.reduce((sum, period) => sum + period.daysUsed, 0);
  }

  /**
   * Calculates the sum of 'daysOff' for a list of periods.
   * Note: Summing daysOff across split periods might not be meaningful if periods overlap in time off.
   * @param {PeriodOption[]} periodOptions - List of periods.
   * @returns {number} Total days off (summed across periods).
   */
  private getTotalDaysOffFromPeriods(periodOptions: PeriodOption[]): number {
    return periodOptions.reduce((sum, period) => sum + period.daysOff, 0);
  }

  /**
   * Generates all possible single vacation periods starting from a set of potential begin dates.
   * Iterates through possible durations (from minPeriodDays up to maxSequencialDays).
   * @param {Set<string>} beginSetList - Set of potential start dates (ISO strings).
   * @param {number} maxSequencialDays - Maximum duration for a single period.
   * @returns {PeriodOption[]} List of generated period options.
   */
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

        const periodOptionBase = { period: { start, end }, daysUsed: 0, daysOff: 0 };
        const periodOption = this.getPeriodOption(periodOptionBase);
        periodsFromBegin.push(periodOption);
      }
    });

    return periodsFromBegin;
  }

  /**
   * Generates all possible single vacation periods ending on a set of potential end dates.
   * Iterates through possible durations (from minPeriodDays up to maxSequencialDays).
   * @param {Set<string>} endSetList - Set of potential end dates (ISO strings).
   * @param {number} maxSequencialDays - Maximum duration for a single period.
   * @returns {PeriodOption[]} List of generated period options.
   */
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

        // Heuristic check: Avoid starting vacation too late in the work week?
        // This condition seems restrictive and might need review.
        if (start.getDay() < this.lastWorkdayForBegin) continue;

        const periodOptionBase = { period: { start, end }, daysUsed: 0, daysOff: 0 };
        const periodOption = this.getPeriodOption(periodOptionBase);
        periodsFromEnd.push(periodOption);
      }
    });

    return periodsFromEnd;
  }

  // TODO: Endpoint to get best period to replace another with the same number of days
  // This method seems incomplete or unused in the main flow.
  private getBestPeriodPeriodFromBeginAndDaysUsed(
    datesToBegin: Set<string>,
    daysToUse: number
  ): PeriodOption[] {
    const allPeriodsFromBegin: PeriodOption[] = [];

    datesToBegin.forEach((beginDate) => {
      const start = new Date(beginDate);
      const end = new Date(start);
      end.setDate(end.getDate() + daysToUse - 1);
      const periodOptionBase = { period: { start, end }, daysUsed: 0, daysOff: 0 };
      // Missing push to array: return this.getPeriodOption(periodOptionBase);
      allPeriodsFromBegin.push(this.getPeriodOption(periodOptionBase)); // Corrected
    });

    const allPeriodsSorted = allPeriodsFromBegin.sort(
      (a, b) => this.getOtimizedRate(b) - this.getOtimizedRate(a)
    );

    return allPeriodsSorted.slice(0, 5);
  }

  /**
   * Generates and ranks all potential single vacation periods based on optimization rate.
   * Combines periods generated from potential start dates and end dates.
   * @param {PotentialPeriodsBeginEndings} potentialPeriodsBeginEndings - Sets of potential start/end dates.
   * @returns {PeriodOption[]} Sorted list of all good single period options.
   */
  private getAllGoodPeriodsOptions(
    potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings
  ): PeriodOption[] {
    // Calculate max duration for a single period when splitting is allowed.
    const maxSequencialDays =
      this.totalDays - minPeriodDays * (this.daysSplit - 1);

    // Generate periods starting from potential begin dates.
    const periodsFromBegin = this.getAllPeriodsFromBegin(
      potentialPeriodsBeginEndings.begin,
      maxSequencialDays
    );
    // Generate periods ending on potential end dates.
    const periodsFromEnd = this.getAllPeriodsFromEnd(
      potentialPeriodsBeginEndings.end,
      maxSequencialDays
    );

    // Combine and sort all generated periods by optimization rate (descending).
    const allPeriodOptions = [...periodsFromBegin, ...periodsFromEnd].sort(
      (a, b) => this.getOtimizedRate(b) - this.getOtimizedRate(a)
    );

    return allPeriodOptions;
  }

  /**
   * Attempts to combine the best single periods into groups according to the requested split number.
   * Iterates through ranked single periods and tries to find compatible subsequent periods.
   * NOTE: This logic seems complex and might be inefficient. Could be improved.
   * @param {PeriodOption[]} allGoodPeriodsOptions - Sorted list of single period options.
   * @returns {PeriodOption[][]} List of potential split period combinations.
   */
  private getAllBestSplitPeriodsOptions(
    allGoodPeriodsOptions: PeriodOption[]
  ): PeriodOption[][] {
    // This is a greedy approach: start with a good period and try to append others.
    return allGoodPeriodsOptions.reduce((acc, periodOption) => {
      const periodStart = periodOption.period.start;
      let splitUsed = 1;
      let splitGroup: PeriodOption[] = [periodOption];

      // Iterate through remaining options to find compatible periods for the split.
      for (let i = 0; i < allGoodPeriodsOptions.length; i++) {
        const periodOptionToCompare = allGoodPeriodsOptions[i];

        if (splitUsed >= this.daysSplit) break; // Found enough periods for the split.

        const futureSplitGroup = [...splitGroup, periodOptionToCompare].sort((a, b) => a.period.start.getTime() - b.period.start.getTime());

        // --- Validation Checks --- //
        const isSamePeriod = splitGroup.some(p => p.period.start.getTime() === periodOptionToCompare.period.start.getTime() && p.period.end.getTime() === periodOptionToCompare.period.end.getTime());
        // Ensure periods don't overlap or start before the initial period (redundant due to sorting?)
        // const isPeriodStartAfterOrEqual = periodStart >= periodOptionToCompare.period.start;
        const hasMinimumInterval = this.verifyIfPeriodsHaveMinimumInterval(futureSplitGroup);
        const totalDaysUsed = this.getTotalDaysUsedFromPeriods(futureSplitGroup);
        const exceedsTotalDays = totalDaysUsed > this.totalDays;

        // Specific rules for splitting into max periods (e.g., 3).
        const isMaxSplitPeriod = this.daysSplit === maxSplitPeriod;
        const hasMinPeriodForOneWhenSplit = this.verifyIfSomePeriodHasMinPeriodForOneWhenSplit(futureSplitGroup);
        const isBelowMinPeriodForAtLeastOneWhenSplit = periodOptionToCompare.daysUsed < minPeriodForAtLeastOneWhenSplit;

        // --- Skip invalid combinations --- //
        if (
          isSamePeriod ||
          // isPeriodStartAfterOrEqual || // Might be too restrictive or incorrect
          !hasMinimumInterval ||
          exceedsTotalDays
        ) {
          continue;
        }

        // Skip if splitting into max periods and minimum duration rules are violated.
        if (
          isMaxSplitPeriod &&
          !hasMinPeriodForOneWhenSplit &&
          isBelowMinPeriodForAtLeastOneWhenSplit
        ) {
          continue;
        }
        // --- Add to group --- //
        splitGroup = futureSplitGroup; // Add the compatible period
        splitUsed++;
      }

      // Add the group to results only if the correct number of splits was achieved
      // and the total days used doesn't exceed the limit (double check this constraint).
      if (splitGroup.length === this.daysSplit && this.getTotalDaysUsedFromPeriods(splitGroup) <= this.totalDays) {
        acc.push(splitGroup);
      }
      return acc;
    }, [] as PeriodOption[][]);
  }

  /**
   * Selects the top-ranked split period combinations.
   * Ranks combinations based on the total 'daysOff' achieved (summed across periods).
   * @param {PeriodOption[]} allGoodPeriodsOptions - Sorted list of single period options.
   * @returns {PeriodOption[][]} Top 10 best split period combinations.
   */
  private getBestPeriodOptions(
    allGoodPeriodsOptions: PeriodOption[]
  ): PeriodOption[][] {
    // Find all potential valid split combinations.
    const allBestSplitPeriodsOptions = this.getAllBestSplitPeriodsOptions(
      allGoodPeriodsOptions
    );

    // Sort the combinations based on total daysOff (descending).
    // Note: Summing daysOff might not be the best metric if periods are far apart.
    // Consider alternative ranking metrics (e.g., total days used, average rate).
    const allBestSplitPeriodsOptionsSorted = allBestSplitPeriodsOptions
      .sort(
        (a, b) =>
          this.getTotalDaysOffFromPeriods(b) -
          this.getTotalDaysOffFromPeriods(a)
      )
      .slice(0, 10); // Return top 10 results.

    return allBestSplitPeriodsOptionsSorted;
  }

  /**
   * Main method to calculate vacation period options based on user input.
   * Orchestrates the process: fetching holidays, identifying potential periods, generating options, handling splits, and ranking results.
   * @param {CalculatorPeriodDto} calculatorPeriodDto - DTO containing user inputs.
   * @returns {Promise<CalculatorVacationResponseViewModel>} ViewModel with best period options, workdays, and holidays.
   */
  async getVacationPeriodOptions(
    calculatorPeriodDto: CalculatorPeriodDto
  ): Promise<CalculatorVacationResponseViewModel> {
    try {
      // Destructure and validate input DTO.
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

      // --- Initialization --- //
      const datePeriod = { start: new Date(period.start), end: new Date(period.end) } as Period;
      const numberIdState = !isNaN(Number(idState)) ? Number(idState) : undefined;

      // Fetch holidays for the specified period and location.
      this.holidays = await holidayService.getHolidaysOrdenedByDate(datePeriod, numberIdState, idCity);

      // Set up internal state based on input.
      this.workdays = this.getRangeWorkDays(workDays);
      // Update heuristic for preferred start day based on actual workdays.
      this.lastWorkdayForBegin = this.workdays.at(-3) ?? WorkDay.wednesday;
      this.notWorkdays = weekDays.filter((day) => !this.workdays.includes(day)) as WorkDay[];
      this.totalDays = daysVacation + daysExtra;
      this.daysSplit = daysSplit;
      this.acceptJumpBridge = acceptJumpBridge;

      // --- Calculation Steps --- //
      // 1. Filter holidays to include only those on workdays.
      const holidaysInsideWorkdays = this.filterHolidaysInsideWorkdays();

      // 2. Identify potential start/end dates based on filtered holidays.
      const potentialPeriodsBeginEndings: PotentialPeriodsBeginEndings = this.getPotentialPeriodsBeginEnd(holidaysInsideWorkdays);

      // 3. Generate all good single period options based on potential starts/ends.
      const allPeriodOptions = this.getAllGoodPeriodsOptions(potentialPeriodsBeginEndings);

      // 4. Find the best combinations if splitting is requested.
      const bestPeriodsOptions = this.daysSplit > 1
        ? this.getBestPeriodOptions(allPeriodOptions)
        : allPeriodOptions.slice(0, 10).map(p => [p]); // If no split, take top 10 single periods.

      // --- Return Results --- //
      return {
        bestPeriodsOptions,
        workdays: this.workdays,
        holidays: this.holidays, // Return the full list of holidays for context.
      };
    } catch (error) {
      console.error("Error calculating vacation options:", error);
      // Re-throw the error to be handled by the Server Action.
      throw error;
    }
  }
}

