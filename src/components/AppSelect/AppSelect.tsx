import React, { useState } from 'react';
import { Input, FormGroup, Label } from 'reactstrap';

type UseAppSelect = [string, Props];
export const useAppSelect = (
  options: SelectOption[],
  initialValue: string,
  changeCB?: (value: string) => void,
): UseAppSelect => {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const handleChange = (value: string) => {
    setSelectedValue(value);
    if (changeCB) changeCB(value);
  };

  return [
    selectedValue,
    {
      options,
      selected: selectedValue,
      handleChange,
    },
  ];
};

export interface SelectOption {
  value: string;
  text: string;
}
interface Props {
  labelText?: string;
  selected: string;
  options: SelectOption[];
  handleChange?: (value: string) => void;
}
const AppSelect: React.FC<Props> = ({
  options,
  handleChange,
  selected,
  labelText,
}) => {
  const optionEls = options.map(opt => {
    return (
      <option key={opt.value} value={opt.value}>
        {opt.text}
      </option>
    );
  });

  return (
    <FormGroup>
      {labelText && <Label>{labelText}</Label>}
      <Input
        type='select'
        value={selected}
        onChange={e => {
          if (handleChange) handleChange(e.target.value);
        }}
      >
        {optionEls}
      </Input>
    </FormGroup>
  );
};

export default AppSelect;
