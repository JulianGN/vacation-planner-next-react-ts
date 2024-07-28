"use client";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { InputNumber } from "primereact/inputnumber";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";

const CalculatorFormStepThree = forwardRef<CalculatorFormStep>((_, ref) => {
  const [daysVacation, setDaysVacation] = useState(10);
  const [daysSplit, setDaysSplit] = useState(1);
  const [daysExtra, setDaysExtra] = useState(0);

  useImperativeHandle(ref, () => ({
    validate: () => {
      return true;
    },
  }));

  return (
    <div className="flex flex-col gap-3 max-w-screen-sm mx-auto">
      <TextTitleDescription
        title="Como gostaria de dividir suas férias?"
        description="Dividir para conquistar! Esse é o segredo!"
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <label htmlFor="calculator-form-step-days-qtd" className="form-label">
            Dias de férias
          </label>
          <InputNumber
            inputId="calculator-form-step-days-qtd"
            value={daysVacation}
            onValueChange={(e) => setDaysVacation(e.value || 0)}
            min={5}
            max={90}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="calculator-form-step-days-split"
            className="form-label"
          >
            Dividir em{" "}
          </label>
          <InputNumber
            inputId="calculator-form-step-days-split"
            value={daysSplit}
            onValueChange={(e) => setDaysSplit(e.value || 1)}
            showButtons
            buttonLayout="horizontal"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            min={1}
            max={3}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="calculator-form-step-days-extra"
            className="form-label"
          >
            Dias de banco
          </label>
          <InputNumber
            inputId="calculator-form-step-days-extra"
            value={daysExtra}
            onValueChange={(e) => setDaysExtra(e.value || 0)}
            min={0}
            max={90}
          />
        </div>
      </div>
    </div>
  );
});

CalculatorFormStepThree.displayName = "CalculatorFormStepThree";
export default CalculatorFormStepThree;
