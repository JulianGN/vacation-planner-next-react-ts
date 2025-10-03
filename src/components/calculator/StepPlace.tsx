"use client";
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
import DropdownSelect from "@/components/shared/Dropdown/DropdownSelect";
import { DropdownChangeEvent } from "primereact/dropdown";
import { fetchStates, fetchCitiesByState } from "@/app/actions"; // Import Server Actions
import { toast } from "react-toastify";
import { SelectListViewModel } from "@/domain/models/SelectListViewModel"; // Import type for checking
import { SelectListGroupByIdViewModel } from "@/domain/models/SelectListGroupByIdViewModel"; // Import type for checking

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

  const fetchStatesAction = async () => {
    if (lists.states.length) return;
    setLoadingStates(true);
    try {
      const result = await fetchStates();
      // Type check: If result is an array, it's the data; otherwise, it's an error object.
      if (Array.isArray(result)) {
        lists.setStates(result);
      } else {
        // It's the error object
        toast.error(`Erro ao buscar estados: ${result.error}`);
        lists.setStates([]);
      }
    } catch (error) {
      console.error("Failed to call fetchStates Server Action:", error);
      toast.error("Erro inesperado ao buscar estados.");
      lists.setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCitiesByStateIdAction = async (idState: number) => {
    setLoadingCities(true);
    try {
      const result = await fetchCitiesByState(idState);
      // Type check: If result is an array, it's the data; otherwise, it's an error object.
      if (Array.isArray(result)) {
        // Extract cities from the grouped result structure
        const cities = result.length > 0 ? result[0].list : [];
        lists.setCities(cities);
      } else {
        // It's the error object
        toast.error(`Erro ao buscar cidades: ${result.error}`);
        lists.setCities([]);
      }
    } catch (error) {
      console.error("Failed to call fetchCitiesByState Server Action:", error);
      toast.error("Erro inesperado ao buscar cidades.");
      lists.setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleStateChange = (e: DropdownChangeEvent) => {
    step.setSelectedState(e.value);
    step.setSelectedCity(null);
    if (e.value?.id) {
      fetchCitiesByStateIdAction(e.value.id);
    }
  };

  const cities = useMemo(() => {
    return step.selectedState && lists.cities ? lists.cities : [];
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
    const isStateSelected = !!step.selectedState;
    const isCitySelected = !!step.selectedCity;
    setValidState(isStateSelected);
    setValidCity(isCitySelected);
    return isStateSelected && isCitySelected;
  };

  useEffect(() => {
    if (!lists.states.length) {
        fetchStatesAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!step.justNational) {
        setValidateTrue();
    }
  }, [
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
        disabled={step.justNational || loadingStates}
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
        disabled={step.justNational || !step.selectedState || loadingCities}
        loading={loadingCities}
        invalid={!step.justNational && !validCity}
        onChange={(e) => step.setSelectedCity(e.value)}
      />
    </div>
  );
});

CalculatorFormStepTwo.displayName = "CalculatorFormStepTwo";
export default CalculatorFormStepTwo;

