"use client";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  SetStateAction,
  useEffect,
} from "react";
import { CalculatorService } from "@/domain/services/CalculatorService";
import { State } from "@/domain/models/State";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";

const calculatorService = new CalculatorService();
const states = calculatorService.getStates();

const CalculatorFormStepTwo = forwardRef<CalculatorFormStep>((_, ref) => {
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [justNational, setJustNational] = useState(false);

  const [validState, setValidState] = useState(true);
  const [validCity, setValidCity] = useState(true);

  const setValidateTrue = () => {
    setValidState(true);
    setValidCity(true);
  };

  const handleChangeJustNational = () => {
    setJustNational(!justNational);

    if (!justNational) {
      setSelectedState(null);
      setSelectedCity(null);
    }
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (justNational) return true;
      if (selectedState && selectedCity) return true;

      setValidState(false);
      setValidCity(false);
      return false;
    },
  }));

  useEffect(setValidateTrue, [justNational, selectedState, selectedCity]);

  return (
    <div className="flex flex-col gap-3 max-w-screen-sm mx-auto">
      <TextTitleDescription
        title="Qual é o estado e a cidade que devemos considerar para calcular os
        feriados?"
        description="Pode ser a cidade sede da empresa ou, se houver, da sua filial."
      />

      <Dropdown
        value={selectedState}
        onChange={(e) => setSelectedState(e.value)}
        options={states}
        optionLabel="nome"
        placeholder={justNational ? "-" : "Selecione o estado"}
        filter
        disabled={justNational}
        invalid={!justNational && !validState}
      />
      <Dropdown
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.value)}
        options={selectedState?.cidades ?? []}
        optionLabel="nome"
        placeholder={
          justNational
            ? "-"
            : !selectedState
            ? "Selecione primeiro o estado"
            : "Selecione a cidade"
        }
        filter
        disabled={justNational || !selectedState}
        invalid={!justNational && !validCity}
      />

      <div className="flex align-items-center">
        <Checkbox
          inputId="calculator-form-input-checkbox-just-nat"
          name="just-nat"
          onChange={handleChangeJustNational}
          checked={justNational}
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
