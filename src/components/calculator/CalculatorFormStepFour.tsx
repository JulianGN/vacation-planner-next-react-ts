"use client";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";
import SelectButton from "@/components/shared/SelectButton/SelectButton";
import { itemsWorkDays } from "@/domain/models/WorkDay";

const CalculatorFormStepFour = forwardRef<CalculatorFormStep>((_, ref) => {
  const { stepPeriodWorkDays } = useCalculatorStore();
  const step = stepPeriodWorkDays;

  const [validWorkDays, setValidWorkDays] = useState(true);

  const handleFullPeriodChange = () => {
    if (!step.fullPeriod) return;

    const fullPeriodFromToday = step.getFullPeriodFromToday();

    step.setPeriod(fullPeriodFromToday);
  };

  const handleSetWorkDays = (values: number[] | null) => {
    step.setWorkDays(values);
    if (step.workDays?.length) setValidWorkDays(true);
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!step.period || !step.workDays?.length) {
        setValidWorkDays(false);
        return false;
      }

      setValidWorkDays(true);
      return true;
    },
  }));

  useEffect(handleFullPeriodChange, [step.fullPeriod]);

  return (
    <div className="flex flex-col gap-3 max-w-screen-sm mx-auto">
      <TextTitleDescription
        title="Qual é o período desejado?"
        description="A partir de quando podemos calcular as melhores opções"
      />
      <div className="flex flex-col gap-2">
        <div className="flex align-items-center">
          <Checkbox
            inputId="calculator-form-input-checkbox-full-period"
            name="full-period"
            onChange={() => step.setFullPeriod(!step.fullPeriod)}
            checked={step.fullPeriod}
          />
          <label
            htmlFor="calculator-form-input-checkbox-full-period"
            className="ml-2"
          >
            Buscar pelos próximos 12 meses
          </label>
        </div>
        <Calendar
          className={step.fullPeriod ? "hidden" : ""}
          value={step.period}
          onChange={(e) => step.setPeriod(e.value)}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          disabled={step.fullPeriod}
        />
      </div>
      <SelectButton
        label="Dias que trabalha:"
        items={itemsWorkDays}
        selectedItems={step.workDays}
        setCheck={handleSetWorkDays}
        sliceItemNameAt={3}
        invalid={!validWorkDays}
      />
    </div>
  );
});

CalculatorFormStepFour.displayName = "CalculatorFormStepFour";
export default CalculatorFormStepFour;
