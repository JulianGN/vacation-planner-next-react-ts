"use client";
import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import {
  maxSplitPeriod,
  minPeriodDays,
} from "@/utils/consts/calculatorVacation";
import { plural } from "@/utils/string";

const CalculatorFormStepThree = forwardRef<CalculatorFormStep>((_, ref) => {
  const { stepDaysVacations } = useCalculatorStore();
  const step = stepDaysVacations;

  const maxDaySplit = useMemo(
    () =>
      Math.min(
        Math.max(Math.floor(step.daysVacation / minPeriodDays), 1),
        maxSplitPeriod
      ),
    [step.daysVacation]
  );

  const { es } = plural(maxDaySplit);

  const onChangeDaysVacation = (e: InputNumberValueChangeEvent) => {
    const daysVacation =
      e?.value && e?.value >= minPeriodDays ? e.value : minPeriodDays;
    step.setDaysVacation(daysVacation);
    step.setValidDaysSplit(true);
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      step.setValidDaysSplit(true);
      step.setValidDaysVacation(true);

      if (step.daysSplit > maxDaySplit) {
        step.setValidDaysSplit(false);
        return false;
      }
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
            onValueChange={onChangeDaysVacation}
            showButtons
            decrementButtonClassName="p-button-outlined"
            incrementButtonClassName="p-button-outlined"
            buttonLayout="horizontal"
            incrementButtonIcon="pi pi-plus"
            decrementButtonIcon="pi pi-minus"
            min={minPeriodDays}
            max={90}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="calculator-form-step-days-split"
            className="form-label">
            Dividir em
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
            max={maxSplitPeriod}
            invalid={!step.validDaysSplit}
          />
          {!step.validDaysSplit && (
            <small className="text-red-500">
              Você pode dividir em até{" "}
              <b>
                {maxDaySplit} vez{es}
              </b>{" "}
              considerando os dias selecionados
            </small>
          )}
        </div>
        {/* TODO: 'Dias de banco' needs to replace acceptJumpBridge when it is false */}
        {/* <div className="flex flex-col">
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
        </div> */}
      </div>
    </div>
  );
});

CalculatorFormStepThree.displayName = "CalculatorFormStepThree";
export default CalculatorFormStepThree;
