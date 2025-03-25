import React, { useState, useRef, useEffect } from "react";

type SelectInputProps = {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
};

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  value,
  required = false,
  disabled = false,
  onChange,
  options,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sinkronisasi nilai input jika prop value berubah
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Filter opsi berdasarkan input (case-insensitive)
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    setIsOpen(false);
    // Membuat event sintetik agar kompatibel dengan onChange
    const syntheticEvent = {
      target: {
        name,
        value: option,
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
  };

  // Menutup dropdown saat klik di luar komponen
  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-full relative" ref={containerRef}>
      <label className="mt-4 text-xs my-2 text-gray-700" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        required={required}
        disabled={disabled}
        placeholder={`Pilih ${label}`}
        value={inputValue}
        onChange={handleInputChange}
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary-light focus:rounded-lg"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 top-full mt-1 rounded-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <li
              key={option}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectInput;
