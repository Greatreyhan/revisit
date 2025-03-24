import React, { ReactNode } from "react";

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  disabled?: boolean;
  value: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  children?: ReactNode;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  required = false,
  disabled = false,
  onChange,
  placeholder,
  children,
}) => {
  return (
    <div className="flex flex-col w-full">
      <label className="mt-4 text-xs my-2 text-gray-700" htmlFor={name}>
        {label}
      </label>
      <div className="flex">
        <input
          className="rounded-l-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none "
          required={required}
          value={value}
          disabled={disabled}
          onChange={onChange}
          name={name}
          id={name}
          type={type}
          placeholder={placeholder}
        />
        {children && <div className="rounded-r-lg border-transparent appearance-none border border-gray-300 h-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base ">{children}</div>}
      </div>
    </div>
  );
};

export default InputField;
