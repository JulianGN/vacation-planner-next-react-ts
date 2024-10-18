"use client";
import { WorkDay } from "@/domain/enums/WorkDay";
import { Period } from "@/domain/models/Holiday";
import React from "react";
import CalendarBase from "@/components/calculator/calendar/CalendarBase";
import { getArrayDatesBetween } from "@/utils/array";
import { PeriodOption } from "@/domain/models/CalculatorVacation";

interface CalendarPeriodProps {
  workdays: WorkDay[];
  holidays: Date[] | string[];
  vacationPeriodOption: PeriodOption;
  acceptJumpBridge?: boolean;
}

const CalendarPeriod: React.FC<CalendarPeriodProps> = ({
  workdays,
  holidays,
  vacationPeriodOption,
  acceptJumpBridge = false,
}) => {
  const start = new Date(vacationPeriodOption?.period?.start);
  const end = new Date(vacationPeriodOption?.period?.end);
  const vacationPeriod = { start, end };
  const periodTitle =
    vacationPeriod &&
    `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;

  const getSplitPeriodsInMonths = (): Period[] => {
    if (!vacationPeriod) return [];

    const arrayDatesBetween = getArrayDatesBetween(start, end);

    const periodsInMonths = arrayDatesBetween.reduce((acc, date) => {
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      const period = acc.get(key);

      const lastDayOfMonth = new Date(year, month + 1, 0);
      if (!period) {
        const periodEnd = Math.min(Number(lastDayOfMonth), Number(end));
        acc.set(key, {
          start: date,
          end: new Date(year, month, periodEnd),
        });
      } else {
        const isSameMonth =
          end.getMonth() === month && end.getFullYear() === year;
        acc.set(key, {
          start: period.start,
          end: isSameMonth ? end : lastDayOfMonth,
        });
      }

      return acc;
    }, new Map<string, Period>());

    return Array.from(periodsInMonths.values());
  };

  const splitPeriodsInMonths = getSplitPeriodsInMonths();

  return (
    <div className="calendar-period">
      <header className="calendar-period-header">
        <h2 className="calendar-period-title">{periodTitle}</h2>
        <div className="calendar-period-subtitle">
          <div className="calendar-period-subtitle-days">
            <p>Dias utilizados: {vacationPeriodOption?.daysUsed}</p>
            <p>
              <b>Dias de férias: {vacationPeriodOption?.daysOff}</b>
            </p>
          </div>
          <h3 className="calendar-period-subtitle-plus">
            (+{vacationPeriodOption?.daysOff - vacationPeriodOption?.daysUsed}{" "}
            dias)
          </h3>
        </div>
      </header>
      <div
        className={
          "calendar-period-container" +
          (splitPeriodsInMonths.length === 1
            ? "calendar-period-container--solo"
            : "")
        }>
        {splitPeriodsInMonths.map((period) => (
          <CalendarBase
            key={period.start.toString()}
            date={period.start}
            workdays={workdays}
            holidays={holidays}
            vacationPeriod={period}
            acceptJumpBridge={acceptJumpBridge}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarPeriod;
