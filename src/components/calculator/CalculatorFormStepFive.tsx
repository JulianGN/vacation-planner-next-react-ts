"use client";
import React from "react";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import CalendarBase from "@/components/calculator/calendar/CalendarBase";

const CalculatorFormStepFive = () => {
  const { stepFinish } = useCalculatorStore();

  return (
    <CalendarBase
      date={new Date(2025, 3)}
      workdays={[1, 2, 3, 4, 5]}
      holidays={[
        new Date("2025-04-18T03:00:00.000Z"),
        new Date("2025-04-20T03:00:00.000Z"),
        new Date("2025-04-21T03:00:00.000Z"),
      ]}
      vacationPeriods={[
        { start: new Date(2025, 3, 22), end: new Date(2025, 3, 30) },
      ]}
    />
  );
};

export default CalculatorFormStepFive;
