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
        <CalendarMultiplePeriods
          workdays={workdays}
          holidays={holidays}
          vacationPeriodOptions={bestPeriodsOptions}
          acceptJumpBridge={true}
        />
      )}
    </>
  );
};

export default CalculatorFormStepFive;
