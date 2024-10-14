"use client";
import React from "react";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Period } from "@/domain/models/Holiday";
import { isSameDay } from "@/utils/date";
import { useCalculatorVacation } from "@/application/hooks/useCalculatorVacation";

const { getFirstWorkDayAfter, getLastWorkDayBefore } = useCalculatorVacation();

interface CalendarBaseProps {
  date: Date | string;
  workdays: WorkDay[];
  holidays: Date[] | string[];
  vacationPeriod: Period;
  showTitle?: boolean;
  acceptJumpBridge?: boolean;
}

interface CalendarDay {
  date: Date;
  isHoliday: boolean;
  isWorkday: boolean;
  isVacationDay: boolean;
  isInsideFullVacationPeriod: boolean;
  isFirstDayVacation: boolean;
  isLastDayVacation: boolean;
  isFirstDayVacationWeek: boolean;
  isLastDayVacationWeek: boolean;
  isFirstDayFullVacation: boolean;
  isLastDayFullVacation: boolean;
}

const CalendarBase: React.FC<CalendarBaseProps> = ({
  date,
  workdays,
  holidays,
  vacationPeriod,
  showTitle = true,
  acceptJumpBridge = false,
}) => {
  const referenceDate = new Date(date);
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const calendarTitle =
    new Date(referenceDate).toLocaleString("default", { month: "long" }) +
    " " +
    year;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDate = new Date(year, month, 1);
  const firstDayOfMonth = firstDate.getDay();

  const verifyIfIsEdgeVacationDay = (
    currentDate: Date,
    isVacationDay: boolean
  ) => {
    const isFirstDayVacationPeriod = isSameDay(
      new Date(vacationPeriod.start),
      currentDate
    );
    const isLastDayVacationPeriod = isSameDay(
      new Date(vacationPeriod.end),
      currentDate
    );

    const isFirstDayVacation = isVacationDay && isFirstDayVacationPeriod;
    const isLastDayVacation = isVacationDay && isLastDayVacationPeriod;

    return { isFirstDayVacation, isLastDayVacation };
  };

  const getCalendarDays = (
    numberOfDays: number,
    year: number,
    month: number,
    vacationPeriod: Period,
    getLastDays = false
  ): CalendarDay[] => {
    const calendarDays: CalendarDay[] = [];
    const start = vacationPeriod.start;
    const end = vacationPeriod.end;
    const lastWorkDayBeforeVacation = getLastWorkDayBefore(
      start,
      holidays,
      workdays,
      acceptJumpBridge
    );
    const firstWorkDayAfterVacation = getFirstWorkDayAfter(
      end,
      holidays,
      workdays,
      acceptJumpBridge
    );

    const verifyIfIsInsideFullVacationPeriod = (currentDate: Date) => {
      return (
        currentDate.getTime() > lastWorkDayBeforeVacation.getTime() &&
        currentDate.getTime() < firstWorkDayAfterVacation.getTime()
      );
    };

    for (let day = 1; day <= numberOfDays; day++) {
      const monthOffset = getLastDays ? month + 1 : month;
      const dayOffset = getLastDays ? 1 - day : day;
      const currentDate = new Date(year, monthOffset, dayOffset);

      const isHoliday = holidays.some((holiday) =>
        isSameDay(new Date(holiday), currentDate)
      );

      const isWorkday = workdays.includes(currentDate.getDay());

      const isVacationDay =
        currentDate.getTime() >= start.getTime() &&
        currentDate.getTime() <= end.getTime();

      const index = calendarDays.length - 1;
      const dayBeforeIsInsideFullVacationPeriod =
        calendarDays[index] && calendarDays[index].isInsideFullVacationPeriod;
      const isEdgeVacation = dayBeforeIsInsideFullVacationPeriod
        ? { isFirstDayVacation: false, isLastDayVacation: false }
        : verifyIfIsEdgeVacationDay(currentDate, isVacationDay);

      if (isEdgeVacation.isLastDayVacation) {
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayisInsideFullVacationPeriod =
          verifyIfIsInsideFullVacationPeriod(nextDay);
        if (nextDayisInsideFullVacationPeriod)
          isEdgeVacation.isLastDayVacation = false;
      }

      const isInsideFullVacationPeriod =
        verifyIfIsInsideFullVacationPeriod(currentDate);

      const isFirstDayVacationWeek =
        (isVacationDay || isInsideFullVacationPeriod) &&
        currentDate.getDay() === 0;
      const isLastDayVacationWeek =
        (isVacationDay || isInsideFullVacationPeriod) &&
        currentDate.getDay() === 6;

      const firstFullVacationDay = new Date(lastWorkDayBeforeVacation);
      firstFullVacationDay.setDate(firstFullVacationDay.getDate() + 1);
      const isFirstDayFullVacation = isSameDay(
        firstFullVacationDay,
        currentDate
      );

      const lastFullVacationDay = new Date(firstWorkDayAfterVacation);
      lastFullVacationDay.setDate(lastFullVacationDay.getDate() - 1);
      const isLastDayFullVacation = isSameDay(lastFullVacationDay, currentDate);

      calendarDays.push({
        date: currentDate,
        isHoliday,
        isWorkday,
        isVacationDay,
        isInsideFullVacationPeriod,
        isFirstDayVacation: isEdgeVacation.isFirstDayVacation,
        isLastDayVacation: isEdgeVacation.isLastDayVacation,
        isFirstDayFullVacation,
        isLastDayFullVacation,
        isFirstDayVacationWeek,
        isLastDayVacationWeek,
      });
    }

    return getLastDays ? calendarDays.reverse() : calendarDays;
  };

  const getDayClasses = (dayInfo: CalendarDay) => {
    const {
      isHoliday,
      isWorkday,
      isVacationDay,
      isFirstDayVacation,
      isLastDayVacation,
      isInsideFullVacationPeriod,
      isFirstDayVacationWeek,
      isLastDayVacationWeek,
      isFirstDayFullVacation,
      isLastDayFullVacation,
    } = dayInfo;

    const isInsideVacationBonus = !isVacationDay && isInsideFullVacationPeriod;

    return `${isHoliday ? "calendar-base-day--holiday" : ""} ${
      isWorkday ? "" : "calendar-base-day--not-workday"
    }
        ${isVacationDay ? "calendar-base-day--vacation" : ""}
        ${
          isFirstDayVacation || isFirstDayVacationWeek
            ? "calendar-base-day--vacation-start"
            : ""
        }
        ${
          isLastDayVacation || isLastDayVacationWeek
            ? "calendar-base-day--vacation-end"
            : ""
        }
        ${
          isInsideVacationBonus ? "calendar-base-day--inside-full-vacation" : ""
        }
        ${
          isFirstDayFullVacation
            ? "calendar-base-day--inside-full-vacation--start"
            : ""
        }
        ${
          isLastDayFullVacation
            ? "calendar-base-day--inside-full-vacation--end"
            : ""
        }
        `;
  };

  const calendarDays = getCalendarDays(
    daysInMonth,
    year,
    month,
    vacationPeriod
  );
  const previousMonthAndYear =
    month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year };
  const previousMonthDays = getCalendarDays(
    firstDayOfMonth,
    previousMonthAndYear.year,
    previousMonthAndYear.month,
    vacationPeriod,
    true
  );
  const nextMonthAndYear =
    month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year };
  const nextMonthNumberDays = 7 - ((daysInMonth + firstDayOfMonth) % 7);
  const nextMonthDays = getCalendarDays(
    nextMonthNumberDays,
    nextMonthAndYear.year,
    nextMonthAndYear.month,
    vacationPeriod
  );

  return (
    <section>
      {showTitle && (
        <header>
          <h3 className="calendar-base-title">{calendarTitle}</h3>
        </header>
      )}
      <div className="calendar-base-container">
        <div className="calendar-base-grid calendar-base-header">
          {[
            { day: "Domingo", abbr: "Dom" },
            { day: "Segunda", abbr: "Seg" },
            { day: "Terça", abbr: "Ter" },
            { day: "Quarta", abbr: "Qua" },
            { day: "Quinta", abbr: "Qui" },
            { day: "Sexta", abbr: "Sex" },
            { day: "Sábado", abbr: "Sáb" },
          ].map((day) => (
            <div key={day.day} className="calendar-base-day">
              <span className="hidden md:inline">{day.day}</span>
              <span className="md:hidden">{day.abbr}</span>
            </div>
          ))}
        </div>
        <div className="calendar-base-grid calendar-base-body">
          {previousMonthDays.map((dayInfo, index) => (
            <div
              key={`previous-month-${index}`}
              className={`calendar-base-day calendar-base-day--another-month calendar-base-day--previous-month ${getDayClasses(
                dayInfo
              )}`}>
              <div className="calendar-base-day-date">
                {dayInfo.date?.getDate()}
              </div>
            </div>
          ))}
          {calendarDays.map((dayInfo, index) => (
            <div
              key={index}
              className={`calendar-base-day ${getDayClasses(dayInfo)}`}>
              <div className="calendar-base-day-date">
                {dayInfo.date?.getDate()}
              </div>
            </div>
          ))}
          {nextMonthDays.map((dayInfo, index) => (
            <div
              key={`next-month-${index}`}
              className={`calendar-base-day calendar-base-day--another-month calendar-base-day--next-month ${getDayClasses(
                dayInfo
              )}
                  `}>
              <div className="calendar-base-day-date">
                {dayInfo.date?.getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CalendarBase;
