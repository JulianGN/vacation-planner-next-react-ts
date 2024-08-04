"use client";
import React, { forwardRef, useImperativeHandle } from "react";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { InputNumber } from "primereact/inputnumber";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";
import useCalculatorStore from "@/application/stores/useCalculatorStore";

const CalculatorFormStepThree = forwardRef<CalculatorFormStep>((_, ref) => {
  const { stepDaysVacations } = useCalculatorStore();
  const step = stepDaysVacations;

  useImperativeHandle(ref, () => ({
    validate: () => {
      return true;
    },
  }));

  return (
    <div className="flex flex-col gap-3 max-w-screen-sm mx-auto">
      <TextTitleDescription
        title="Quantas vezes gostaria de sair de férias?"
        description="Dividir para conquistar: esse é o segredo!"
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <label htmlFor="calculator-form-step-days-qtd" className="form-label">
            Dias de férias
          </label>
          <InputNumber
            inputId="calculator-form-step-days-qtd"
            value={step.daysVacation}
            onValueChange={(e) => step.setDaysVacation(e.value || 0)}
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
            buttonLayout="horizontal"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
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
            value={step.daysSplit}
            onValueChange={(e) => step.setDaysSplit(e.value || 1)}
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
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
            value={step.daysExtra}
            onValueChange={(e) => step.setDaysExtra(e.value || 0)}
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
            buttonLayout="horizontal"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
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
