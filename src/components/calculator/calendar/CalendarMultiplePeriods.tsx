"use client";
import { WorkDay } from "@/domain/enums/WorkDay";
import React from "react";
import CalendarPeriod from "@/components/calculator/calendar/CalendarPeriod";
import { PeriodOption } from "@/domain/models/CalculatorVacation";

interface CalendarMultiplePeriodProps {
  workdays: WorkDay[];
  holidays: Date[] | string[];
  vacationPeriodOptions: PeriodOption[][];
  acceptJumpBridge?: boolean;
}

const CalendarMultiplePeriod: React.FC<CalendarMultiplePeriodProps> = ({
  workdays,
  holidays,
  vacationPeriodOptions,
  acceptJumpBridge = false,
}) => {
  return (
    <>
      {vacationPeriodOptions.map((periodList, index) =>
        periodList.map((period, i) => (
          <div>
            <CalendarPeriod
              key={`period-${index}-${i}-${period.period.start}`}
              workdays={workdays}
              holidays={holidays}
              vacationPeriodOption={period}
              acceptJumpBridge={acceptJumpBridge}
            />
          </div>
        ))
      )}
    </>
  );
};

export default CalendarMultiplePeriod;
