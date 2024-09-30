"use client";
import React from "react";
import useCalculatorStore from "@/application/stores/useCalculatorStore";

const CalculatorFormStepFive = () => {
  const { stepFinish } = useCalculatorStore();

  return (
    stepFinish.periodOptions && (
      <div className="text-5xl text-center">{stepFinish.periodOptions}</div>
    )
  );
};

export default CalculatorFormStepFive;
