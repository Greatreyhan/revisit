import React from "react";

type SelectInputProps = {
    label: string;
    name: string;
    value: string;
    required?: boolean;
    disabled?:boolean;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
};

const SelectInput: React.FC<SelectInputProps> = ({ label, name, value, required=false, disabled=false, onChange, options }) => {
    return (
        <div className="flex flex-col w-full">
            <label className="mt-4 text-xs my-2 text-gray-700" htmlFor={name}>
                {label}
            </label>
            <select
                className="ounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary-light focus:rounded-lg focus:border-transparent"
                required={required}
                value={value}
                onChange={onChange}
                disabled={disabled}
                name={name}
                id={name}
            >
                <option value="">Pilih {label}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectInput;
