"use client";
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { Calendar } from "primereact/calendar";
import { InputSwitch } from "primereact/inputswitch";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";
import SelectButton from "@/components/shared/SelectButton/SelectButton";
import { itemsWorkDays } from "@/domain/models/WorkDay";
import { getDiffDays } from "@/utils/date";

const CalculatorFormStepFour = forwardRef<CalculatorFormStep>((_, ref) => {
  const { stepPeriodWorkDays } = useCalculatorStore();
  const step = stepPeriodWorkDays;
  const calendarRef = useRef<any>(null);

  const [validWorkDays, setValidWorkDays] = useState(true);
  const [validPeriod, setValidPeriod] = useState(true);

  const handleFullPeriodChange = () => {
    if (!step.fullPeriod) return;

    if (calendarRef.current) calendarRef.current.hide();

    const fullPeriodFromToday = step.getFullPeriodFromToday();

    step.setPeriod(fullPeriodFromToday);
  };

  const handleSetWorkDays = (values: number[] | null) => {
    step.setWorkDays(values);
    if (step.workDays?.length) setValidWorkDays(true);
  };

  const validatePeriodSize = () => {
    if (!step.period) return;

    const [start, end] = step.period;
    if (!start || !end) return false;

    return getDiffDays(start, end) <= 365;
  };

  const handlePeriod = (e: any) => {
    step.setPeriod(e.value);
    if (step.period) setValidPeriod(true);
  };

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!step.period || !step.workDays?.length) {
        setValidWorkDays(false);
        return false;
      }

      if (!validatePeriodSize()) {
        setValidPeriod(false);
        return false;
      }

      setValidWorkDays(true);
      setValidPeriod(true);
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
        <div className="flex items-center justify-center">
          <InputSwitch
            inputId="calculator-form-input-checkbox-full-period"
            name="full-period"
            onChange={() => step.setFullPeriod(!step.fullPeriod)}
            checked={step.fullPeriod}
          />
          <label
            htmlFor="calculator-form-input-checkbox-full-period"
            className="ml-2">
            Buscar pelos próximos 12 meses
          </label>
        </div>
        <div
          className="w-full"
          onClick={() => {
            if (step.fullPeriod) {
              step.setFullPeriod(false);
            }
          }}>
          <Calendar
            ref={calendarRef}
            className="w-full"
            value={step.period}
            onChange={handlePeriod}
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
            disabled={step.fullPeriod}
            invalid={!validPeriod}
          />
          {!validPeriod && (
            <div>
              <small className="text-red-500">
                O período deve ser de no máximo 1 ano
              </small>
            </div>
          )}
        </div>
      </div>
      <SelectButton
        label="Dias que trabalha:"
        items={itemsWorkDays}
        selectedItems={step.workDays}
        setCheck={handleSetWorkDays}
        sliceItemNameAt={3}
        invalid={!validWorkDays}
      />
      <div className="flex items-center justify-center">
        <InputSwitch
          inputId="calculator-form-input-checkbox-accept-jump-bridge"
          name="accept-jump-bridge"
          onChange={() => step.setAcceptJumpBridge(!step.acceptJumpBridge)}
          checked={step.acceptJumpBridge}
        />
        <label
          htmlFor="calculator-form-input-checkbox-accept-jump-bridge"
          className="ml-2">
          Emendar feriados quando possível
        </label>
      </div>
    </div>
  );
});

CalculatorFormStepFour.displayName = "CalculatorFormStepFour";
export default CalculatorFormStepFour;
