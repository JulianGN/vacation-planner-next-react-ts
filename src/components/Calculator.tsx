"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import CalculatorHeader from "./CalculatorHeader";
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
      <CalculatorHeader />
      <CalculatorForm />
    </section>
  );
};

export default Calculator;
