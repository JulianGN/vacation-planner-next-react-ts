"use client";
import React, { useState, useRef } from "react";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { Button } from "primereact/button";
import Step from "@/components/shared/Step/Step";
import CalculatorFormStepOne from "@/components/calculator/CalculatorFormStepOne";
import CalculatorFormStepTwo from "@/components/calculator/CalculatorFormStepTwo";
import CalculatorFormStepThree from "@/components/calculator/CalculatorFormStepThree";
import CalculatorFormStepFour from "@/components/calculator/CalculatorFormStepFour";
import CalculatorFormStepFive from "@/components/calculator/CalculatorFormStepFive";
import { CalculatorFormStepIndex } from "@/domain/enums/CalculatorFormStepIndex";
import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import { HolidayPeriod } from "@/domain/models/Holiday";
import { CalculatorPeriodService } from "@/application/services/CalculatorPeriodService";

const calculatorPeriodService = new CalculatorPeriodService();

const CalculatorForm = () => {
  const { stepPlace, stepPeriodWorkDays, stepDaysVacations, stepFinish } =
    useCalculatorStore();

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

  const handleBack = () => {
    const newStep = step + 1 < steps ? step - 1 : 0;
    setStep(newStep);
  };

  const validateStep = () => {
    switch (step) {
      case CalculatorFormStepIndex.stepPlace:
        return stepTwo.current?.validate();
      case CalculatorFormStepIndex.stepDaysVacations:
        return stepThree.current?.validate();
      case CalculatorFormStepIndex.stepPeriodWorkDays:
        return stepFour.current?.validate();
      default:
        return true;
    }
  };

  const getCalculatorPayload = () => {
    const justNational = stepPlace.justNational;
    const idState = justNational ? null : stepPlace.selectedState?.id;
    const idCity = justNational ? null : stepPlace.selectedCity?.id;
    const daysVacation = stepDaysVacations.daysVacation;
    const daysSplit = stepDaysVacations.daysSplit;
    const daysExtra = stepDaysVacations.daysExtra;
    const [start, end] = stepPeriodWorkDays.period ?? [];
    const period = { start, end } as HolidayPeriod;
    const workDays = stepPeriodWorkDays.workDays;
    const acceptJumpBridge = stepPeriodWorkDays.acceptJumpBridge;

    const payload = {
      idState,
      idCity,
      daysVacation,
      daysSplit,
      daysExtra,
      period,
      workDays,
      acceptJumpBridge,
    } as CalculatorPeriodDto;

    return payload;
  };

  const handleForward = () => {
    if (!validateStep()) return;

    const newStep = step < steps ? step + 1 : step;
    setStep(newStep);

    if (newStep === CalculatorFormStepIndex.stepFinish) {
      const payload = getCalculatorPayload();

      calculatorPeriodService.getPeriodOptions(payload).then((response) => {
        stepFinish.setPeriodOptions(
          // TODO: TEMP
          response.bestPeriods?.map((p: any) => JSON.stringify(p)).join(", ")
        );
      });
    }
  };

  return (
    <>
      <header className="pt-6">
        <Step step={step} icons={icons} setStep={setStep} />
      </header>
      <article className="flex flex-col gap-3 mt-3 p-6">
        {step === CalculatorFormStepIndex.stepStart && (
          <CalculatorFormStepOne />
        )}
        {step === CalculatorFormStepIndex.stepPlace && (
          <CalculatorFormStepTwo ref={stepTwo} />
        )}
        {step === CalculatorFormStepIndex.stepDaysVacations && (
          <CalculatorFormStepThree ref={stepThree} />
        )}
        {step === CalculatorFormStepIndex.stepPeriodWorkDays && (
          <CalculatorFormStepFour ref={stepFour} />
        )}
        {step === CalculatorFormStepIndex.stepFinish && (
          <CalculatorFormStepFive />
        )}

        <div className="flex justify-center gap-3 mt-4">
          {step > CalculatorFormStepIndex.stepStart && (
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
