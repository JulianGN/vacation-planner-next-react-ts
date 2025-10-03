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
import { HolidayViewModel } from "@/domain/models/HolidayViewModel";

interface CalendarMultiplePeriodProps {
  workdays: WorkDay[];
  holidays: HolidayViewModel[];
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

  const CalendarLegend = () => (
    <div className="flex flex-wrap justify-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <div 
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: 'var(--vc-primary-400)' }}
        ></div>
        <span className="text-sm text-gray-700">Final de semana / Ponte</span>
      </div>
      <div className="flex items-center gap-2">
        <div 
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: 'var(--vc-primary-700)' }}
        ></div>
        <span className="text-sm text-gray-700">Período de férias oficial</span>
      </div>
      <div className="flex items-center gap-2">
        <div 
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: 'var(--vc-primary-900)' }}
        ></div>
        <span className="text-sm text-gray-700">Feriado</span>
      </div>
    </div>
  );

  return (
    <div>
      <CalendarLegend />
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
    </div>
  );
};

export default CalendarMultiplePeriod;
