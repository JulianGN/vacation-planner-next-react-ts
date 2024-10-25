import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
} from "react";
import useCalculatorStore from "@/application/stores/useCalculatorStore";
import { CalculatorFormStep } from "@/domain/models/CalculatorFormStep";
import { InputSwitch } from "primereact/inputswitch";
import TextTitleDescription from "@/components/shared/Text/TextTitleDescription";
import { ApiCalculatorPeriodService } from "@/api/ApiCalculatorPeriodService";
import DropdownSelect from "@/components/shared/Dropdown/DropdownSelect";
import { DropdownChangeEvent } from "primereact/dropdown";

const calculatorService = new ApiCalculatorPeriodService();

const CalculatorFormStepTwo = forwardRef<CalculatorFormStep>((_, ref) => {
  const { stepPlace, lists } = useCalculatorStore();
  const step = stepPlace;

  const [validState, setValidState] = useState(true);
  const [validCity, setValidCity] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

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
    if (lists.states.length) return;

    setLoadingStates(true);
    const states = await calculatorService.getStates();
    lists.setStates(states);
    setLoadingStates(false);
  };

  const fetchCitiesByStateId = async (idState: number) => {
    setLoadingCities(true);
    const cities = await calculatorService.getCitiesByIdState(idState);
    lists.setCities(cities);
    setLoadingCities(false);
  };

  const handleStateChange = (e: DropdownChangeEvent) => {
    step.setSelectedState(e.value);
    step.setSelectedCity(null);
    fetchCitiesByStateId(e.value.id);
  };

  const cities = useMemo(() => {
    return step.selectedState ? lists.cities : [];
  }, [step.selectedState, lists.cities]);

  const placeholderState = useMemo(() => {
    if (step.justNational) return "-";
    if (loadingStates) return "Carregando estados...";
    return "Selecione o estado";
  }, [step.justNational, loadingStates]);

  const placeholderCity = useMemo(() => {
    if (step.justNational) return "-";
    if (loadingCities) return "Carregando cidades...";
    if (!step.selectedState) return "Selecione primeiro o estado";
    return "Selecione a cidade";
  }, [step.justNational, loadingCities, step.selectedState]);

  const validate = () => {
    if (step.justNational) return true;
    if (step.selectedState && step.selectedCity) return true;

    setValidState(false);
    setValidCity(false);
    return false;
  };

  useEffect(() => {
    fetchStates();
  });

  useEffect(setValidateTrue, [
    step.justNational,
    step.selectedState,
    step.selectedCity,
  ]);

  useImperativeHandle(ref, () => ({
    validate,
  }));

  return (
    <div className="flex flex-col gap-3 max-w-screen-sm mx-auto">
      <TextTitleDescription
        title="Onde fica sua empresa?"
        description="Isso nos ajuda a buscar os melhores períodos considerando os feriados municipais e estaduais."
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
      <DropdownSelect
        id="calculator-form-dropdown-state"
        value={step.selectedState}
        options={lists.states ?? []}
        optionLabel="name"
        placeholder={placeholderState}
        filter
        disabled={
          !lists.states.length ||
          step.justNational ||
          loadingStates ||
          loadingCities
        }
        loading={loadingStates}
        invalid={!step.justNational && !validState}
        onChange={handleStateChange}
      />
      <DropdownSelect
        id="calculator-form-dropdown-city"
        value={step.selectedCity}
        options={cities}
        optionLabel="name"
        placeholder={placeholderCity}
        filter
        disabled={
          step.justNational ||
          !step.selectedState ||
          !cities?.length ||
          loadingCities
        }
        invalid={!step.justNational && !validCity}
        onChange={(e) => step.setSelectedCity(e.value)}
      />
    </div>
  );
});

CalculatorFormStepTwo.displayName = "CalculatorFormStepTwo";
export default CalculatorFormStepTwo;
