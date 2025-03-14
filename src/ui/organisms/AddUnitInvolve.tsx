import React, { useState } from 'react';
import InputField from '../molecules/InputField';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';

interface UnitInvolve {
    VIN: string;
    mileage: string;
}

interface AddUnitInvolveProps {
    unitInvolves: UnitInvolve[];
    setUnitInvolves: (unitInvolves: UnitInvolve[]) => void;
}

const AddUnitInvolve: React.FC<AddUnitInvolveProps> = ({ unitInvolves, setUnitInvolves }) => {
    const [VINInvolve, setVINInvolve] = useState<string>('');
    const [MileageInvolve, setMileageInvolve] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleAddUnit = () => {
        if (VINInvolve && MileageInvolve) {
            setUnitInvolves([...unitInvolves, { VIN: VINInvolve, mileage: MileageInvolve }]);
            setVINInvolve('');
            setMileageInvolve('');
            setIsModalOpen(false);
        }
    };

    return (
        <div>
            {/* View */}
            <div className='mt-4'>
                {/* List Unit Terlibat */}
                <table className="table p-4 bg-white rounded-lg shadow w-full">
                    <thead>
                        <tr>
                            <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">#</th>
                            <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">VIN</th>
                            <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Mileage (KM)</th>
                            <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900 w-24">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unitInvolves.map((unit, index) => (
                            <tr key={index} className="text-gray-700">
                                <td className="border p-1.5 dark:border-dark-5 text-center">{index + 1}</td>
                                <td className="border p-1.5 dark:border-dark-5 text-center">{unit.VIN}</td>
                                <td className="border p-1.5 dark:border-dark-5 text-center">{unit.mileage}</td>
                                <td className="border-t p-1.5 flex gap-x-3 justify-around items-center">
                                    <button
                                        type="button"
                                        className="p-2 text-sky-800 rounded-full bg-sky-100"
                                        onClick={() => console.log('delete')}
                                    >
                                        <MdEdit />
                                    </button>
                                    <button
                                        className="p-2 text-rose-800 rounded-full bg-rose-100"
                                        type="button"
                                        onClick={() => console.log('delete')}
                                    >
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    type="button" onClick={() => setIsModalOpen(true)}
                    className="mt-4 px-6 py-2 w-full flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                >
                    <MdAdd className="mr-2" />
                    Tambah Unit Terlibat
                </button>
                
            </div>

            {/* Pop Up */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4">Tambah Unit Terlibat</h2>
                        <InputField label="VIN Unit Terlibat" name="VINInvolve" value={VINInvolve} onChange={(e) => setVINInvolve(e.target.value)} placeholder="Masukkan VIN unit yang terlibat" />
                        <InputField label="Jarak Tempuh Unit Terlibat (KM)" type="number" name="MileageInvolve" value={MileageInvolve} onChange={(e) => setMileageInvolve(e.target.value)} placeholder="Masukkan jarak tempuh unit yang terlibat" />
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={handleAddUnit} className="px-4 py-2 bg-primary text-white rounded">Tambah</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white text-primary rounded mr-2">Batal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddUnitInvolve;