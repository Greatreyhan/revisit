import React, { useEffect, useRef } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to match content
    }
  };

  useEffect(() => {
    adjustHeight(); // Adjust height when component mounts or updates
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default new line behavior
      const cursorPos = textareaRef.current?.selectionStart || 0;
      const newValue =
        value.slice(0, cursorPos) + " ↵\n" + value.slice(cursorPos);
      
      onChange({
        target: { name, value: newValue }
      } as React.ChangeEvent<HTMLTextAreaElement>);
      
      setTimeout(adjustHeight, 0); // Adjust height after inserting new line
    }
  };

  return (
    <div className="flex flex-col w-full">
      <label className="mt-4 text-xs my-2" htmlFor={name}>
        {label}
      </label>
      <textarea
        ref={textareaRef}
        className="w-full px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent resize-none"
        required={required}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        name={name}
        id={name}
        placeholder={placeholder}
        rows={1}
      ></textarea>
    </div>
  );
};

export default TextField;
