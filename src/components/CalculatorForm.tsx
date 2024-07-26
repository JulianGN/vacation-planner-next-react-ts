"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { CalculatorService } from "@/domain/services/CalculatorService";
import { State } from "@/domain/models/State";
import { translateWorkDay, WorkDay } from "@/domain/models/WorkDay";
import { Nullable } from "primereact/ts-helpers";

const calculatorService = new CalculatorService();
const states = calculatorService.getStates();

const CalculatorForm = () => {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [daysVacation, setDaysVacation] = useState(10);
  const [daysSplit, setDaysSplit] = useState(1);
  const [daysExtra, setDaysExtra] = useState(0);
  const [fullPeriod, setFullPeriod] = useState(true);
  const [period, setPeriod] = useState<Nullable<(Date | null)[]>>(null);
  const [workDays, setWorkDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });

  const handleCalculate = () => {
    if (typeof window !== "undefined") {
      router.push("/sobre");
    }
  };

  const handleWorkDayChange = (day: WorkDay) => {
    setWorkDays(() => ({
      ...workDays,
      [day]: !workDays[day],
    }));
  };

  return (
    <article>
      <div className="grid grid-cols-2">
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
      <div className="">
        <InputNumber
          value={daysVacation}
          onValueChange={(e) => setDaysVacation(e.value || 0)}
          min={5}
          max={90}
        />
        <InputNumber
          value={daysSplit}
          onValueChange={(e) => setDaysSplit(e.value || 1)}
          showButtons
          buttonLayout="horizontal"
          style={{ width: "2rem" }}
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
          min={1}
          max={5}
        />
        <InputNumber
          value={daysExtra}
          onValueChange={(e) => setDaysExtra(e.value || 0)}
          min={0}
          max={90}
        />
      </div>
      <div className="flex flex-wrap justify-content-center gap-3">
        <div className="flex align-items-center">
          <Checkbox
            inputId="calculator-form-input-checkbox-full-period"
            name="full-period"
            onChange={() => setFullPeriod(!fullPeriod)}
            checked={fullPeriod}
          />
          <label
            htmlFor="calculator-form-input-checkbox-full-period"
            className="ml-2"
          >
            Buscar todos os feriados 12 meses a partir de hoje
          </label>
        </div>
        <div>
          <Calendar
            value={period}
            onChange={(e) => setPeriod(e.value)}
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-content-center gap-3">
        {Object.keys(workDays).map((day) => (
          <div key={day}>
            <Checkbox
              inputId={"calculator-form-input-checkbox-work-day-" + day}
              name={"work-day-" + day}
              checked={workDays[day as WorkDay]}
              onChange={() => handleWorkDayChange(day as WorkDay)}
            />
            <label htmlFor={"calculator-form-input-checkbox-work-day-" + day}>
              {translateWorkDay(day as WorkDay)}
            </label>
          </div>
        ))}
      </div>
      <div>
        <Button label="Calcular" onClick={handleCalculate} />
      </div>
    </article>
  );
};

export default CalculatorForm;
