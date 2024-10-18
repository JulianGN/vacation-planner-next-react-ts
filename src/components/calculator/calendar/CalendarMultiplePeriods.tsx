"use client";
import { WorkDay } from "@/domain/enums/WorkDay";
import React from "react";
import CalendarPeriod from "@/components/calculator/calendar/CalendarPeriod";
import { PeriodOption } from "@/domain/models/CalculatorVacation";
import {
  TabView,
  TabPanel,
  TabPanelHeaderTemplateOptions,
} from "primereact/tabview";
import { getStringDayMonth } from "@/utils/date";

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
  const scrollableTabs = vacationPeriodOptions.map((periodList) => {
    const periodRange = periodList.reduce(
      (acc, period, index) => {
        const start = new Date(period?.period?.start);
        const end = new Date(period?.period?.end);

        acc.title.push(
          `${getStringDayMonth(start)} - ${getStringDayMonth(end)}`
        );
        acc.content.push(
          <CalendarPeriod
            key={"period-" + index}
            workdays={workdays}
            holidays={holidays}
            vacationPeriodOption={period}
            acceptJumpBridge={acceptJumpBridge}
          />
        );
        acc.days += period.daysOff;

        return acc;
      },
      { title: [], content: [], days: 0 } as {
        title: string[];
        content: React.JSX.Element[];
        days: number;
      }
    );

    return {
      title: periodRange.title.join(", "),
      content: periodRange.content,
      days: `${periodRange.days} dias`,
    };
  });

  const headerTemplate = (
    options: TabPanelHeaderTemplateOptions,
    days: string,
    dates: string
  ) => {
    return (
      <div
        className={`calendar-multiple-period-tab-header ${
          options.selected && "calendar-multiple-period-tab-header--selected"
        }`}
        style={{ cursor: "pointer" }}
        onClick={options.onClick}>
        <span className="font-bold">{days}</span>
        <small className="text-xs text-nowrap">{dates}</small>
      </div>
    );
  };

  return (
    <TabView scrollable>
      {scrollableTabs.map((tab) => {
        return (
          <TabPanel
            key={tab.title}
            header={tab.title}
            headerTemplate={(options) =>
              headerTemplate(options, tab.days, tab.title)
            }>
            {tab.content}
          </TabPanel>
        );
      })}
    </TabView>
  );
};

export default CalendarMultiplePeriod;
