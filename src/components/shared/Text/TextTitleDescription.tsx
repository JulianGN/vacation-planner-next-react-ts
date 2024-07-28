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
      <h2 className={`text-2xl md:text-4xl font-light mb-0 ${textAlign}`}>
        {title}
      </h2>
      <p className={`text-slate-600 mt-1 ${textAlign}`}>{description}</p>
    </div>
  );
};

export default StepTitleDescription;
