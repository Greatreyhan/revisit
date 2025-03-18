import React from "react";

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  required = false,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col w-full">
      <label className="mt-4 text-xs my-2 text-gray-700" htmlFor={name}>
        {label}
      </label>
      <input
        className="ounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary-light focus:rounded-lg focus:border-transparent"
        required={required}
        value={value}
        onChange={onChange}
        name={name}
        id={name}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;