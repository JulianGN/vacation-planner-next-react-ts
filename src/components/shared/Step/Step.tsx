import React, { useMemo, useRef } from "react";
import { Steps, StepsSelectEvent } from "primereact/steps";
import { MenuItem } from "primereact/menuitem";
import { Toast } from "primereact/toast";
import StepCircle from "@/components/shared/Step/StepCircle";

interface StepProps {
  step: number;
  icons: string[];
  setStep: (index: number) => void;
}

const Step: React.FC<StepProps> = ({ step, icons, setStep }) => {
  const stepItems = icons.map((icon, i) => ({
    icon,
    template: () => StepCircle({ step: step, itemIndex: i, setStep, icon }),
  })) as MenuItem[];

  const toast = useRef<Toast>(null);
  const lastStep = useMemo(
    () => step === icons.length - 1,
    [step, icons.length]
  );

  const showToast = () => {
    toast.current?.clear();
    toast.current?.show({
      severity: "info",
      detail: "Navegue pelos botões na parte inferior do formulário",
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!lastStep) showToast();
  };

  const handleSelect = (event: StepsSelectEvent) => {
    if (lastStep) setStep(event.index);
  };

  return (
    <>
      <Steps
        model={stepItems}
        activeIndex={step}
        readOnly={!lastStep}
        className="m-2 pt-4"
        onClick={handleClick}
        onSelect={handleSelect}
      />
      <Toast ref={toast} />
    </>
  );
};

export default Step;
