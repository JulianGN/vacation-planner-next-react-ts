import React from "react";

interface SelectButtonItemProps {
  name: string;
  sliceItemNameAt: number;
}

const StepCircle: React.FC<SelectButtonItemProps> = ({
  name,
  sliceItemNameAt,
}) => {
  const textFirstPart = name.slice(0, sliceItemNameAt);
  const textSecondPart = name.slice(sliceItemNameAt);

  return (
    <>
      <span>{textFirstPart}</span>
      {textSecondPart.length && (
        <span className="hidden md:inline">{textSecondPart}</span>
      )}
    </>
  );
};

export default StepCircle;
