"use client";
import React from "react";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import CalendarPeriod from "@/components/calculator/calendar/CalendarPeriod";

const CalculatorFormStepFive = () => {
  const { stepFinish } = useCalculatorStore();

  return (
    <CalendarPeriod
      workdays={[1, 2, 3, 4, 5]}
      holidays={[
        new Date("2025-04-18T03:00:00.000Z"),
        new Date("2025-04-21T03:00:00.000Z"),
        new Date("2025-05-01T03:00:00.000Z"),
      ]}
      vacationPeriod={{
        start: new Date(2025, 3, 22),
        end: new Date(2025, 3, 30),
      }}
      acceptJumpBridge={true}
    />
  );
};

export default CalculatorFormStepFive;
