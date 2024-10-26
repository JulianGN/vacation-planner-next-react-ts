import React from "react";

interface StepTitleDescriptionProps {
  title: string;
  description: string;
  textAlign?: string;
}

const StepTitleDescription: React.FC<StepTitleDescriptionProps> = ({
  title,
  description,
  textAlign = "text-center",
}) => {
  return (
    <div>
      <h2 className={`text-3xl md:text-5xl mb-0 ${textAlign}`}>{title}</h2>
      <p className={`text-slate-600 mt-1 ${textAlign}`}>{description}</p>
    </div>
  );
};

export default StepTitleDescription;
