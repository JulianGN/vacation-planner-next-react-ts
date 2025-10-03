"use client";
import React, { useState, useRef } from "react";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { Button } from "primereact/button";
import Step from "@/components/shared/Step/Step";
import StepIntro from "@/components/calculator/StepIntro";
import StepPlace from "@/components/calculator/StepPlace";
import StepVacationDays from "@/components/calculator/StepVacationDays";
import StepPeriod from "@/components/calculator/StepPeriod";
import StepResult from "@/components/calculator/StepResult";
import { CalculatorFormStepIndex } from "@/domain/enums/CalculatorFormStepIndex";
import { CalculatorPeriodDto } from "@/application/dtos/CalculatorPeriodDto";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import { Period } from "@/domain/models/CalculatorVacation";
import useUiStore from "@/application/stores/useUiStore";
import { getVacationOptions } from "@/app/actions"; // Import Server Action
import { toast } from "react-toastify";

const CalculatorForm = () => {
  const { setLoading } = useUiStore();
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
    const newStep = step > 0 ? step - 1 : 0;
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

  const getCalculatorPayload = (): CalculatorPeriodDto => {
    const justNational = stepPlace.justNational;
    const idState = justNational ? undefined : stepPlace.selectedState?.id;
    const idCity = justNational ? undefined : stepPlace.selectedCity?.id;
    
    const daysVacation = stepDaysVacations.daysVacation;
    const daysSplit = stepDaysVacations.daysSplit;
    const daysExtra = stepDaysVacations.daysExtra;
    const [start, end] = stepPeriodWorkDays.period ?? [];
    // Ensure dates are correctly formatted if needed by the backend/action
    const period = { start, end } as Period;
    const workDays = stepPeriodWorkDays.workDays;
    const acceptJumpBridge = stepPeriodWorkDays.acceptJumpBridge;

    const payload = {
      idState: typeof idState === 'number' ? idState : undefined,
      idCity: typeof idCity === 'string' || typeof idCity === 'number' ? String(idCity) : undefined,
      daysVacation,
      daysSplit,
      daysExtra,
      period,
      workDays,
      acceptJumpBridge,
    } as CalculatorPeriodDto;

    return payload;
  };

  const handleForward = async () => { // Make async for Server Action
    if (!validateStep()) return;

    const newStep = step + 1 < steps ? step + 1 : step;

    if (newStep === CalculatorFormStepIndex.stepFinish) {
      const payload = getCalculatorPayload();
      setLoading(true);
      try {
        const result = await getVacationOptions(payload);
        if (result.error) {
          console.error("Error from Server Action:", result.error);
          toast.error(`Erro ao calcular: ${result.error}`); // User feedback
          // Optionally, prevent moving to the next step or handle the error state
        } else if (result.periodOptions) {
          stepFinish.setPeriodOptions(result.periodOptions);
          setStep(newStep); // Move to next step only on success
        } else {
           toast.error("Resposta inesperada do servidor.");
        }
      } catch (error) {
        console.error("Failed to call Server Action:", error);
        toast.error("Ocorreu um erro inesperado. Tente novamente.");
      } finally {
        setLoading(false);
      }
    } else {
      setStep(newStep); // Move to next step for non-final steps
    }
  };

  return (
    <>
      <header className="pt-6">
        <Step step={step} icons={icons} setStep={setStep} />
      </header>
      <article className="flex flex-col gap-3 mt-3 py-6">
        {step === CalculatorFormStepIndex.stepStart && <StepIntro />}
        {step === CalculatorFormStepIndex.stepPlace && (
          <StepPlace ref={stepTwo} />
        )}
        {step === CalculatorFormStepIndex.stepDaysVacations && (
          <StepVacationDays ref={stepThree} />
        )}
        {step === CalculatorFormStepIndex.stepPeriodWorkDays && (
          <StepPeriod ref={stepFour} />
        )}
        {step === CalculatorFormStepIndex.stepFinish && <StepResult />}

        <div className="flex justify-center gap-3 mt-4">
          {step > CalculatorFormStepIndex.stepStart && (
            <Button
              outlined
              // Label change: Allow going back from the results page
              label={step === CalculatorFormStepIndex.stepFinish ? "Voltar" : "Voltar"}
              onClick={handleBack}
            />
          )}
          {step < CalculatorFormStepIndex.stepFinish && ( // Ensure button doesn't show on final step
            <Button
              label={
                step === CalculatorFormStepIndex.stepStart
                  ? "Vamos lá!"
                  : "Avançar"
              }
              onClick={handleForward}
              // Disable button while loading results
              disabled={useUiStore.getState().loading}
            />
          )}
        </div>
      </article>
    </>
  );
};

export default CalculatorForm;

