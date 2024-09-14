import React from "react";
import { SelectButton } from "primereact/selectbutton";
import SelectButtonItem from "./SelectButtonItem";
import { SelectButtonItemList } from "@/domain/models/SelectButton";

interface SelectButtonProps {
  label: string;
  selectedItems: number[] | null;
  items: SelectButtonItemList[];
  sliceItemNameAt: number;
  invalid: boolean;
  setCheck: (item: number[] | null) => void;
}

const Step: React.FC<SelectButtonProps> = ({
  label,
  selectedItems,
  items,
  sliceItemNameAt,
  invalid,
  setCheck,
}) => {
  return (
    <div className="flex flex-col gap-1 mt-3">
      {label && <label className="form-label">{label}</label>}
      <SelectButton
        className="custom-select-button custom-select-button--weekdays"
        value={selectedItems}
        onChange={(e) => setCheck(e.value)}
        optionLabel="name"
        options={items}
        itemTemplate={(item: SelectButtonItemList) =>
          SelectButtonItem({
            name: item.name,
            sliceItemNameAt,
          })
        }
        multiple
        invalid={invalid}
      />
    </div>
  );
};

export default Step;
