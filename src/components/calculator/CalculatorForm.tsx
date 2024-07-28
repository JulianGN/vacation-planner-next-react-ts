"use client";
import React, { useState, useRef } from "react";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import Step from "@/components/shared/Step/Step";
import CalculatorFormStepOne from "./CalculatorFormStepOne";
import CalculatorFormStepTwo from "./CalculatorFormStepTwo";
import CalculatorFormStepThree from "./CalculatorFormStepThree";
import CalculatorFormStepFour from "./CalculatorFormStepFour";
import CalculatorFormStepFive from "./CalculatorFormStepFive";

const CalculatorForm = () => {
  const router = useRouter();

  const icons = [
    "pi pi-star",
    "pi pi-map-marker",
    "pi pi-gift",
    "pi pi-calendar-plus",
    "pi pi-check-circle",
  ];
  const steps = icons.length;
  const [step, setStep] = useState(0);
  const stepTwo = useRef<CalculatorFormStep>(null);
  const stepThree = useRef<CalculatorFormStep>(null);
  const stepFour = useRef<CalculatorFormStep>(null);

  const handleCalculate = () => {
    if (typeof window == "undefined") {
      router.push("/sobre");
    }
  };

  const handleBack = () => {
    const newStep = step + 1 < steps ? step - 1 : 0;
    setStep(newStep);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return stepTwo.current?.validate();
      case 2:
        return stepThree.current?.validate();
      case 3:
        return stepFour.current?.validate();
      default:
        return true;
    }
  };

  const handleForward = () => {
    if (!validateStep()) return;

    const newStep = step < steps ? step + 1 : step;
    setStep(newStep);
  };

  return (
    <>
      <header className="pt-6">
        <Step step={step} icons={icons} setStep={setStep} />
      </header>
      <article className="flex flex-col gap-3 mt-3 p-6">
        {step === 0 && <CalculatorFormStepOne />}
        {step === 1 && <CalculatorFormStepTwo ref={stepTwo} />}
        {step === 2 && <CalculatorFormStepThree ref={stepThree} />}
        {step === 3 && <CalculatorFormStepFour ref={stepFour} />}
        {step === 4 && <CalculatorFormStepFive />}

        <div className="flex justify-center gap-3 mt-4">
          {step > 0 && (
            <Button
              outlined
              label={step + 1 === steps ? "Preencher novamente" : "Voltar"}
              onClick={handleBack}
            />
          )}
          {step + 1 < steps && (
            <Button
              label={
                step === 0
                  ? "Vamos lá!"
                  : step === steps
                  ? "Finalizar"
                  : "Avançar"
              }
              onClick={handleForward}
            />
          )}
        </div>
      </article>
    </>
  );
};

export default CalculatorForm;
