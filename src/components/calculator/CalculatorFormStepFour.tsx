"use client";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { Nullable } from "primereact/ts-helpers";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";
import SelectButton from "@/components/shared/SelectButton/SelectButton";
import { WorkDay } from "@/domain/enums/WorkDay";

const CalculatorFormStepFour = forwardRef<CalculatorFormStep>((_, ref) => {
  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setMonth(today.getMonth() + 12);

  const [period, setPeriod] = useState<Nullable<(Date | null)[]>>([
    today,
    nextYear,
  ]);
  const [fullPeriod, setFullPeriod] = useState(true);

  const handleFullPeriodChange = () => {
    if (!fullPeriod) return;

    setPeriod([today, nextYear]);
  };

  const itemsWorkDays = [
    { name: "Domingo", value: WorkDay.sunday },
    { name: "Segunda", value: WorkDay.monday },
    { name: "Terça", value: WorkDay.tuesday },
    { name: "Quarta", value: WorkDay.wednesday },
    { name: "Quinta", value: WorkDay.thursday },
    { name: "Sexta", value: WorkDay.friday },
    { name: "Sábado", value: WorkDay.saturday },
  ];

  const notWorkDay = [WorkDay.saturday, WorkDay.sunday];
  const initialWorkDays = itemsWorkDays.reduce((acc, item) => {
    if (!notWorkDay.includes(item.value)) {
      acc.push(item.value);
    }
    return acc;
  }, [] as number[]);
  const [workDays, setWorkDays] = useState<number[] | null>(initialWorkDays);

  const [validWorkDays, setValidWorkDays] = useState(true);

  const handleSetWorkDays = (values: number[] | null) => {
    setWorkDays(values);
    if (workDays?.length) setValidWorkDays(true);
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!period || !workDays?.length) {
        setValidWorkDays(false);
        return false;
      }

      setValidWorkDays(true);
      return true;
    },
  }));

  useEffect(handleFullPeriodChange, [fullPeriod]);

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
            onChange={() => setFullPeriod(!fullPeriod)}
            checked={fullPeriod}
          />
          <label
            htmlFor="calculator-form-input-checkbox-full-period"
            className="ml-2"
          >
            Buscar pelos próximos 12 meses
          </label>
        </div>
        <Calendar
          className={fullPeriod ? "hidden" : ""}
          value={period}
          onChange={(e) => setPeriod(e.value)}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          disabled={fullPeriod}
        />
      </div>
      <SelectButton
        label="Dias que trabalha:"
        items={itemsWorkDays}
        selectedItems={workDays}
        setCheck={handleSetWorkDays}
        sliceItemNameAt={3}
        invalid={!validWorkDays}
      />
    </div>
  );
});

CalculatorFormStepFour.displayName = "CalculatorFormStepFour";
export default CalculatorFormStepFour;
