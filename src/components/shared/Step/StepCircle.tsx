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
  const color = isActiveItem ? "var(--vc-primary)" : "gray";
  const fontSize = isActiveItem ? "2.5rem" : "1.25rem";

  return (
    <div
      className={styles["vc-step-circle"]}
      onClick={() => setStep(itemIndex)}>
      <i
        className={`${icon}`}
        style={{
          color,
          fontSize,
        }}
      />
    </div>
  );
};

export default StepCircle;
