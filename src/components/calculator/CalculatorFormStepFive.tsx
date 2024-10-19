"use client";
import React from "react";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import CalendarMultiplePeriods from "@/components/calculator/calendar/CalendarMultiplePeriods";

const CalculatorFormStepFive = () => {
  const { stepFinish } = useCalculatorStore();
  const { bestPeriodsOptions, workdays, holidays } = stepFinish.periodOptions;

  return (
    <>
      {!!bestPeriodsOptions?.length && (
        <div>
          <h2 className="text-2xl md:text-4xl font-light text-center px-3 mt-0">
            Confira abaixo <b>{bestPeriodsOptions?.length} opções</b> de
            distribuição de dias pra suas férias!
          </h2>
          <CalendarMultiplePeriods
            workdays={workdays}
            holidays={holidays}
            vacationPeriodOptions={bestPeriodsOptions}
            acceptJumpBridge={true}
          />
        </div>
      )}
    </>
  );
};

export default CalculatorFormStepFive;
