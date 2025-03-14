import React from "react";

interface TextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = "", 
  required = false 
}) => {
  return (
    <div className="flex flex-col w-full">
      <label className="mt-4 text-xs my-2" htmlFor={name}>
        {label}
      </label>
      <textarea
        className="flex-1 w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
        required={required}
        value={value}
        onChange={onChange}
        name={name}
        id={name}
        placeholder={placeholder}
      ></textarea>
    </div>
  );
};

export default TextField;
