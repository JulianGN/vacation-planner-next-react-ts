import React, { useRef } from "react";
import { Steps } from "primereact/steps";
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

  const showToast = () => {
    toast.current?.clear();
    toast.current?.show({
      severity: "info",
      detail: "Navegue pelos botões na parte inferior do formulário",
    });
  };

  return (
    <>
      <Steps
        model={stepItems}
        activeIndex={step}
        readOnly={true}
        className="m-2 pt-4"
        onClick={showToast}
      />
      <Toast ref={toast} />
    </>
  );
};

export default Step;
