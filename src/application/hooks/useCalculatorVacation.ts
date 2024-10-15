import { WorkDay } from "@/domain/enums/WorkDay";

export const useCalculatorVacation = () => {
  function verifyIfDaysIsWorkDay(date: Date, workdays: WorkDay[]): boolean {
    return workdays?.includes(date.getDay());
  }

  function verifyIfDaysIsHoliday(date: Date, holidayDates: Date[]): boolean {
    return holidayDates?.some((holiday) => {
      const currentHolidayDate = new Date(holiday);

      return currentHolidayDate.getTime() === date.getTime();
    });
  }

  function verifyIfIsNotWorkDay(
    date: Date,
    holidayDates: Date[],
    workdays: WorkDay[]
  ): boolean {
    const isHoliday = verifyIfDaysIsHoliday(date, holidayDates);
    const isWorkDay = verifyIfDaysIsWorkDay(date, workdays);

    return isHoliday || !isWorkDay;
  }

  function verifyIfIsBridge(
    date: Date,
    holidayDates: Date[],
    workdays: WorkDay[]
  ): boolean {
    const dayBefore = new Date(date);
    dayBefore.setDate(date.getDate() - 1);
    const dayBeforeIsNotWorkDay = verifyIfIsNotWorkDay(
      dayBefore,
      holidayDates,
      workdays
    );

    const dayAfter = new Date(date);
    dayAfter.setDate(date.getDate() + 1);
    const dayAfterIsNotWorkDay = verifyIfIsNotWorkDay(
      dayAfter,
      holidayDates,
      workdays
    );

    return dayBeforeIsNotWorkDay && dayAfterIsNotWorkDay;
  }

  function verifyIfDaysIsNotWorkDayOrBridge(
    date: Date,
    holidayDates: Date[],
    workdays: WorkDay[],
    acceptJumpBridge: boolean
  ): boolean {
    const isNotWorkDay = verifyIfIsNotWorkDay(date, holidayDates, workdays);
    const isBridge = acceptJumpBridge
      ? verifyIfIsBridge(date, holidayDates, workdays)
      : false;

    return isNotWorkDay || isBridge;
  }

  function getClosestWorkDay(
    currentDate: Date,
    before: boolean,
    holidayDates: Date[],
    workdays: WorkDay[],
    acceptJumpBridge: boolean
  ): Date {
    const date = new Date(currentDate);
    const increment = before ? -1 : 1;

    date.setDate(date.getDate() + increment);

    while (
      verifyIfDaysIsNotWorkDayOrBridge(
        date,
        holidayDates,
        workdays,
        acceptJumpBridge
      )
    ) {
      date.setDate(date.getDate() + increment);
    }

    return date;
  }

  function getLastWorkDayBefore(
    holidayDate: Date,
    holidayDates: Date[] | string[],
    workdays: WorkDay[],
    acceptJumpBridge: boolean
  ): Date {
    const dates = holidayDates.map((date) => new Date(date));
    return getClosestWorkDay(
      holidayDate,
      true,
      dates,
      workdays,
      acceptJumpBridge
    );
  }

  function getFirstWorkDayAfter(
    holidayDate: Date,
    holidayDates: Date[] | string[],
    workdays: WorkDay[],
    acceptJumpBridge: boolean
  ): Date {
    const dates = holidayDates.map((date) => new Date(date));
    return getClosestWorkDay(
      holidayDate,
      false,
      dates,
      workdays,
      acceptJumpBridge
    );
  }

  return {
    verifyIfDaysIsWorkDay,
    getLastWorkDayBefore,
    getFirstWorkDayAfter,
    getClosestWorkDay,
    verifyIfDaysIsHoliday,
  };
};
