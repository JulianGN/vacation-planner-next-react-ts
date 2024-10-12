"use client";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Period } from "@/domain/models/Holiday";
import React from "react";

interface CalendarBaseProps {
  date: Date | string;
  workdays: WorkDay[];
  holidays: Date[] | string[];
  vacationPeriods: Period[];
}

const CalendarBase: React.FC<CalendarBaseProps> = ({
  date,
  workdays,
  holidays,
  vacationPeriods,
}) => {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDate = new Date(year, month, 1);
  const firstDayOfMonth = firstDate.getDay();
  const listOfPreviosMonthDays = Array.from({ length: firstDayOfMonth })
    .map((_, index) => new Date(year, month, index * -1))
    .reverse();

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

      return (
        holidayDate.getFullYear() === year &&
        holidayDate.getMonth() === month &&
        holidayDate.getDate() === day
      );
    });
    const isWorkday = workdays.includes(currentDate.getDay());
    const isVacationDay = vacationPeriods.some((period) => {
      return (
        currentDate.getTime() >= period.start.getTime() &&
        currentDate.getTime() <= period.end.getTime()
      );
    });

    calendarDays.push({
      date: currentDate,
      isHoliday,
      isWorkday,
      isVacationDay,
    });
  }

  return (
    <section>
      <header>
        <h2>
          {date.toLocaleString("default", { month: "long" })} {year}
        </h2>
      </header>
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
              className="calendar-base-day calendar-base-day--previous-month">
              <div className="calendar-base-day-date">{day.getDate()}</div>
            </div>
          ))}
          {calendarDays.map((dayInfo, index) => {
            const { date, isHoliday, isWorkday, isVacationDay } = dayInfo;
            const isFirstDayVacationWeek = isVacationDay && date.getDay() === 0;
            const isLastDayVacationWeek = isVacationDay && date.getDay() === 6;
            const isFirstDayVacation =
              isVacationDay &&
              (!calendarDays[index - 1]?.isVacationDay ||
                isFirstDayVacationWeek);
            const isLastDayVacation =
              isVacationDay &&
              (!calendarDays[index + 1]?.isVacationDay ||
                isLastDayVacationWeek);

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
                <div className="calendar-base-day-date">{date.getDate()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CalendarBase;
