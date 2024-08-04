"use client";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import { CalculatorService } from "@/application/services/CalculatorService";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";

const calculatorService = new CalculatorService();
const states = calculatorService.getStates();

const CalculatorFormStepTwo = forwardRef<CalculatorFormStep>((_, ref) => {
  const { stepPlace } = useCalculatorStore();
  const step = stepPlace;

  const [validState, setValidState] = useState(true);
  const [validCity, setValidCity] = useState(true);

  const setValidateTrue = () => {
    setValidState(true);
    setValidCity(true);
  };

  const handleChangeJustNational = () => {
    step.setJustNational(!step.justNational);

    if (!step.justNational) {
      step.setSelectedState(null);
      step.setSelectedCity(null);
    }
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (step.justNational) return true;
      if (step.selectedState && step.selectedCity) return true;

      setValidState(false);
      setValidCity(false);
      return false;
    },
  }));

  useEffect(setValidateTrue, [
    step.justNational,
    step.selectedState,
    step.selectedCity,
  ]);

  return (
    <div className="flex flex-col gap-3 max-w-screen-sm mx-auto">
      <TextTitleDescription
        title="Qual é o estado e a cidade que devemos considerar para calcular os
        feriados?"
        description="Pode ser a cidade sede da empresa ou, se houver, da sua filial."
      />

      <Dropdown
        value={step.selectedState}
        onChange={(e) => step.setSelectedState(e.value)}
        options={states}
        optionLabel="nome"
        placeholder={step.justNational ? "-" : "Selecione o estado"}
        filter
        disabled={step.justNational}
        invalid={!step.justNational && !validState}
      />
      <Dropdown
        value={step.selectedCity}
        onChange={(e) => step.setSelectedCity(e.value)}
        options={step.selectedState?.cidades ?? []}
        optionLabel="nome"
        placeholder={
          step.justNational
            ? "-"
            : !step.selectedState
            ? "Selecione primeiro o estado"
            : "Selecione a cidade"
        }
        filter
        disabled={step.justNational || !step.selectedState}
        invalid={!step.justNational && !validCity}
      />

      <div className="flex align-items-center">
        <Checkbox
          inputId="calculator-form-input-checkbox-just-nat"
          name="just-nat"
          onChange={handleChangeJustNational}
          checked={step.justNational}
        />
        <label
          htmlFor="calculator-form-input-checkbox-just-nat"
          className="ml-2"
        >
          Considerar apenas feriados nacionais
        </label>
      </div>
    </div>
  );
});

CalculatorFormStepTwo.displayName = "CalculatorFormStepTwo";
export default CalculatorFormStepTwo;
