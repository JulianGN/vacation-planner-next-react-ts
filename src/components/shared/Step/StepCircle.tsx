import React from "react";
import styles from "./StepCircle.module.css";

interface StepCircleProps {
  step: number;
  itemIndex: number;
  setStep: (index: number) => void;
  icon: string;
}

const StepCircle: React.FC<StepCircleProps> = ({
  step,
  itemIndex,
  setStep,
  icon,
}) => {
  const isActiveItem = step === itemIndex;
  const backgroundColor = isActiveItem
    ? "var(--vc-primary)"
    : "var(--vc-slate-100)";
  const textColor = isActiveItem ? "var(--vc-slate-100)" : "gray";

  return (
    <div
      className={styles["vc-step-circle"]}
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
      onClick={() => setStep(itemIndex)}
    >
      <i className={`${icon} text-xl`} />
    </div>
  );
};

export default StepCircle;
