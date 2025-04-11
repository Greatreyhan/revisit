import React, { useState } from 'react';
import SelectInput from '../molecules/SelectInput';
import { dataModelIsuzu } from '../../utils/masterData';
import { MdDelete } from 'react-icons/md';

interface PropsUnitTraining {
  unit: string[];
  disabled? : boolean;
  setUnit: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddUnitTraining: React.FC<PropsUnitTraining> = ({ disabled=false, unit, setUnit }) => {
  const [inputValue, setInputValue] = useState<string>("");

  // Fungsi untuk menambah item ke dalam array unit
  const addUnit = () => {
    if (inputValue.trim() !== "" && !unit.includes(inputValue)) {
      setUnit(prev => [...prev, inputValue]);
      setInputValue("");
    }
  };

  // Fungsi untuk menghapus item dari array unit
  const removeUnit = (value: string) => {
    setUnit(prev => prev.filter(item => item !== value));
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-end gap-x-3">
          <SelectInput
            label="Tipe Unit"
            name="typeUnit"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            options={dataModelIsuzu}
          />
          <button
            type="button"
            onClick={addUnit}
            className="mt-2 bg-primary hover:bg-primary-dark font-semibold text-white px-4 py-2 rounded"
          >
            Tambah
          </button>
        </div>
      </div>
      <div>
        <h2 className="font-semibold">Unit List</h2>
        {unit.length > 0 ? (
          <ul>
            {unit.map((item, index) => (
              <li key={index} className="flex items-center justify-between my-1 p-2 rounded">
                <span>{index + 1}. {item}</span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeUnit(item)}
                  className="bg-primary hover:bg-primary-dark text-white rounded-full p-1.5"
                >
                  <MdDelete className="text-xl" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Belum ada unit yang ditambahkan.</p>
        )}
      </div>
    </div>
  );
};

export default AddUnitTraining;
