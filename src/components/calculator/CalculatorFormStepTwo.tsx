import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useMemo,
} from "react";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";
import { CalculatorService } from "@/application/services/CalculatorService";

const calculatorService = new CalculatorService();

const CalculatorFormStepTwo = forwardRef<CalculatorFormStep>((_, ref) => {
  const { stepPlace, lists } = useCalculatorStore();
  const step = stepPlace;

  const [validState, setValidState] = useState(true);
  const [validCity, setValidCity] = useState(true);
  const statesFetched = useRef(false);
  const loadingCities = useRef(false);

  const setValidateTrue = () => {
    setValidState(true);
    setValidCity(true);
  };

  const handleChangeJustNational = () => {
    step.setJustNational(!step.justNational);

    if (!step.justNational) {
      step.setSelectedState(null);
      step.setSelectedCity(null);
    }
  };

  const fetchStates = async () => {
    if (statesFetched.current) return;

    const states = await calculatorService.getStates();
    lists.setStates(states);
    statesFetched.current = true;
  };

  const fetchCitiesByStateId = async (stateId: number) => {
    loadingCities.current = true;
    const cities = await calculatorService.getCitiesByStateId(stateId);
    lists.setCities(cities);
    console.log("cities", cities);
    loadingCities.current = false;
  };

  const handleStateChange = (e: DropdownChangeEvent) => {
    step.setSelectedState(e.value);
    step.setSelectedCity(null);
    fetchCitiesByStateId(e.value.id);
  };

  const cities = useMemo(() => {
    return step.selectedState ? lists.cities : [];
  }, [step.selectedState, lists.cities]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (step.justNational) return true;
      if (step.selectedState && step.selectedCity) return true;

      setValidState(false);
      setValidCity(false);
      return false;
    },
  }));
  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(setValidateTrue, [
    step.justNational,
    step.selectedState,
    step.selectedCity,
  ]);

  return (
    <div className="flex flex-col gap-3 max-w-screen-sm mx-auto">
      <TextTitleDescription
        title="Qual é o estado e a cidade que devemos considerar para calcular os
        feriados?"
        description="Pode ser a cidade sede da empresa ou, se houver, da sua filial."
      />
      <div className="flex items-center justify-center">
        <InputSwitch
          inputId="calculator-form-input-checkbox-just-nat"
          name="just-nat"
          onChange={handleChangeJustNational}
          checked={step.justNational}
        />
        <label
          htmlFor="calculator-form-input-checkbox-just-nat"
          className="ml-2">
          Considerar apenas feriados nacionais
        </label>
      </div>
      <Dropdown
        value={step.selectedState}
        onChange={handleStateChange}
        options={lists.states ?? []}
        optionLabel="name"
        placeholder={step.justNational ? "-" : "Selecione o estado"}
        filter
        disabled={step.justNational || loadingCities.current}
        invalid={!step.justNational && !validState}
      />
      <Dropdown
        value={step.selectedCity}
        onChange={(e) => step.setSelectedCity(e.value)}
        options={cities}
        optionLabel="name"
        placeholder={
          step.justNational
            ? "-"
            : !step.selectedState
            ? "Selecione primeiro o estado"
            : "Selecione a cidade"
        }
        filter
        disabled={
          step.justNational ||
          !step.selectedState ||
          !cities?.length ||
          loadingCities.current
        }
        invalid={!step.justNational && !validCity}
      />
    </div>
  );
});

CalculatorFormStepTwo.displayName = "CalculatorFormStepTwo";
export default CalculatorFormStepTwo;
