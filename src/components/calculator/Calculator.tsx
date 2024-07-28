"use client";
import React from "react";
import { useRouter } from "next/navigation";
import CalculatorForm from "./CalculatorForm";

const Calculator = () => {
  const router = useRouter();

  const handleCalculate = () => {
    if (typeof window !== "undefined") {
      router.push("/sobre");
    }
  };

  return (
    <section>
      <CalculatorForm />
    </section>
  );
};

export default Calculator;
