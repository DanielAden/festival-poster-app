import React, { useState } from 'react';

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

interface SelectOption {
    value: string;
    text: string;
}
interface Props {
    selected: string;
    options: SelectOption[];
    handleChange?: (value: string) => void;
}
const AppSelect: React.FC<Props> = ({ options, handleChange, selected }) => {
    const optionEls = options.map(opt => {
        return (
            <option key={opt.value} value={opt.value}>
                {opt.text}
            </option>
        );
    });

    return (
        <select
            value={selected}
            onChange={e => {
                if (handleChange) handleChange(e.target.value);
            }}
        >
            {optionEls}
        </select>
    );
};

export default AppSelect;
