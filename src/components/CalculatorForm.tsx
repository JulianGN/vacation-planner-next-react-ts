"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { CalculatorService } from "@/domain/services/CalculatorService";
import { State } from "@/domain/models/State";

const calculatorService = new CalculatorService();
const states = calculatorService.getStates();

const CalculatorForm = () => {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<State | null>(null);

  const handleCalculate = () => {
    if (typeof window !== "undefined") {
      router.push("/sobre");
    }
  };

  return (
    <article>
      <div>
        <Dropdown
          value={selectedState}
          onChange={(e) => setSelectedState(e.value)}
          options={states}
          optionLabel="nome"
          placeholder="Selecione o estado"
          filter
        />
        <Dropdown
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.value)}
          options={selectedState?.cidades ?? []}
          optionLabel="nome"
          placeholder={
            !selectedState
              ? "Selecione primeiro o estado"
              : "Selecione a cidade"
          }
          filter
          disabled={!selectedState}
        />
      </div>
      <div>
        <Button label="Calcular" onClick={handleCalculate} />
      </div>
    </article>
  );
};

export default CalculatorForm;
