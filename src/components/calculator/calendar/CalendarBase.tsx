"use client";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Period } from "@/domain/models/Holiday";
import { isSameDay } from "@/utils/date";
import React from "react";

interface CalendarBaseProps {
  date: Date | string;
  workdays: WorkDay[];
  holidays: Date[] | string[];
  vacationPeriod: Period;
  showTitle?: boolean;
}

const CalendarBase: React.FC<CalendarBaseProps> = ({
  date,
  workdays,
  holidays,
  vacationPeriod,
  showTitle = true,
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
  const listOfPreviosMonthDays = Array.from({ length: firstDayOfMonth })
    .map((_, index) => new Date(year, month, index * -1))
    .reverse();
  const listOfNextMonthDays = Array.from({
    length: 7 - ((daysInMonth + firstDayOfMonth) % 7),
  }).map((_, index) => new Date(year, month + 1, index + 1));

  const calendarDays: {
    date: Date;
    isHoliday: boolean;
    isWorkday: boolean;
    isVacationDay: boolean;
  }[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const isHoliday = holidays.some((holiday) => {
      const holidayDate = new Date(holiday);

      return isSameDay(holidayDate, currentDate);
    });
    const isWorkday = workdays.includes(currentDate.getDay());
    const isVacationDay =
      currentDate.getTime() >= vacationPeriod.start.getTime() &&
      currentDate.getTime() <= vacationPeriod.end.getTime();

    calendarDays.push({
      date: currentDate,
      isHoliday,
      isWorkday,
      isVacationDay,
    });
  }

  const verifyIfIsEdgeVacationDay = (
    currentDate: Date,
    isVacationDay: boolean
  ) => {
    const isFirstDayVacationWeek = isVacationDay && currentDate.getDay() === 0;
    const isLastDayVacationWeek = isVacationDay && currentDate.getDay() === 6;
    const isFirstDayVacationPeriod = isSameDay(
      new Date(vacationPeriod.start),
      currentDate
    );
    const isLastDayVacationPeriod = isSameDay(
      new Date(vacationPeriod.end),
      currentDate
    );

    const isFirstDayVacation =
      isVacationDay && (isFirstDayVacationPeriod || isFirstDayVacationWeek);
    const isLastDayVacation =
      isVacationDay && (isLastDayVacationPeriod || isLastDayVacationWeek);

    return { isFirstDayVacation, isLastDayVacation };
  };

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
          {listOfPreviosMonthDays.map((day, i) => (
            <div
              key={`previous-month-${i}`}
              className="calendar-base-day calendar-base-day--another-month calendar-base-day--previous-month">
              <div className="calendar-base-day-date">{day.getDate()}</div>
            </div>
          ))}
          {calendarDays.map((dayInfo, index) => {
            const { date, isHoliday, isWorkday, isVacationDay } = dayInfo;
            const currentDate = new Date(date);
            const { isFirstDayVacation, isLastDayVacation } =
              verifyIfIsEdgeVacationDay(currentDate, isVacationDay);

            return (
              <div
                key={index}
                className={`calendar-base-day ${
                  isHoliday ? "calendar-base-day--holiday" : ""
                } ${isWorkday ? "" : "calendar-base-day--not-workday"}
                ${isVacationDay ? "calendar-base-day--vacation" : ""}
                ${isFirstDayVacation ? "calendar-base-day--vacation-start" : ""}
                ${isLastDayVacation ? "calendar-base-day--vacation-end" : ""}
                `}>
                <div className="calendar-base-day-date">
                  {currentDate.getDate()}
                </div>
              </div>
            );
          })}
          {listOfNextMonthDays.map((day, i) => (
            <div
              key={`next-month-${i}`}
              className="calendar-base-day calendar-base-day--another-month calendar-base-day--next-month">
              <div className="calendar-base-day-date">{day.getDate()}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CalendarBase;
