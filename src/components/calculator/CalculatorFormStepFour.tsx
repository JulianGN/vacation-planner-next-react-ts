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
import { translateWorkDay, WorkDay } from "@/domain/models/WorkDay";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";

const CalculatorFormStepFour = forwardRef<CalculatorFormStep>((_, ref) => {
  const [period, setPeriod] = useState<Nullable<(Date | null)[]>>(null);
  const [fullPeriod, setFullPeriod] = useState(true);

  const handleFullPeriodChange = () => {
    if (!fullPeriod) return;

    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setMonth(today.getMonth() + 12);

    setPeriod([today, nextYear]);
  };

  const [workDays, setWorkDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false,
  });
  const handleWorkDayChange = (day: WorkDay) => {
    setWorkDays(() => ({
      ...workDays,
      [day]: !workDays[day],
    }));
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
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
          value={period}
          onChange={(e) => setPeriod(e.value)}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          disabled={fullPeriod}
        />
      </div>
      <div className="flex flex-col gap-3 mt-3">
        <label>Dias que trabalha:</label>
        <div className="flex flex-wrap justify-content-center gap-x-12 gap-y-2">
          {Object.keys(workDays).map((day) => (
            <div key={day} className="flex items-center gap-2">
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
      </div>
    </div>
  );
});

export default CalculatorFormStepFour;
