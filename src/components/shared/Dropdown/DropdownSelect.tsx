import React, { useRef } from "react";
import { Dropdown, DropdownProps } from "primereact/dropdown";

const DropdownSelect: React.FC<DropdownProps> = (props) => {
  const dropdownRef = useRef<Dropdown>(null);

  const focusDropdownInput = () => {
    setTimeout(() => {
      const input = dropdownRef.current?.getOverlay()?.querySelector("input");
      input?.focus();
    }, 0);
  };

  return <Dropdown ref={dropdownRef} {...props} onShow={focusDropdownInput} />;
};

export default DropdownSelect;
