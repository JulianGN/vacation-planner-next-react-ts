"use client";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Period } from "@/domain/models/Holiday";
import React from "react";
import CalendarBase from "@/components/calculator/calendar/CalendarBase";
import { getArrayDatesBetween } from "@/utils/array";

interface CalendarPeriodProps {
  workdays: WorkDay[];
  holidays: Date[] | string[];
  vacationPeriod: Period;
}

const CalendarPeriod: React.FC<CalendarPeriodProps> = ({
  workdays,
  holidays,
  vacationPeriod,
}) => {
  const periodTitle =
    vacationPeriod &&
    `${vacationPeriod.start.toLocaleDateString()} - ${vacationPeriod.end.toLocaleDateString()}`;

  const getSplitPeriodsInMonths = (vacationPeriod: Period): Period[] => {
    if (!vacationPeriod) return [];

    const arrayDatesBetween = getArrayDatesBetween(
      vacationPeriod.start,
      vacationPeriod.end
    );

    const periodsInMonths = arrayDatesBetween.reduce((acc, date) => {
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      const period = acc.get(key);

      const lastDayOfMonth = new Date(year, month + 1, 0);
      if (!period) {
        const end = Math.min(
          Number(lastDayOfMonth),
          Number(new Date(vacationPeriod.end))
        );
        acc.set(key, {
          start: date,
          end: new Date(year, month, end),
        });
      } else {
        const vacationEnd = vacationPeriod.end;
        const isSameMonth =
          vacationEnd.getMonth() === month &&
          vacationEnd.getFullYear() === year;
        acc.set(key, {
          start: period.start,
          end: isSameMonth ? vacationEnd : lastDayOfMonth,
        });
      }

      return acc;
    }, new Map<string, Period>());

    return Array.from(periodsInMonths.values());
  };

  return (
    <div className="calendar-period card">
      <header>
        <h2 className="calendar-period-title">{periodTitle}</h2>
      </header>
      <div className="calendar-period-container">
        {getSplitPeriodsInMonths(vacationPeriod).map((period) => (
          <CalendarBase
            key={period.start.toString()}
            date={period.start}
            workdays={workdays}
            holidays={holidays}
            vacationPeriod={period}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarPeriod;
