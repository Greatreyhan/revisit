import React, { useState } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import SelectInput from '../molecules/SelectInput';
import { Materi } from '../interface/Materi';
import { classificationMateri } from '../../utils/masterData';

interface AddMateriProps {
    material: Materi[];
    setMaterial: (items: Materi[]) => void;
}

const AddMateri: React.FC<AddMateriProps> = ({ material, setMaterial }) => {
    const [type, setType] = useState<string>('');
    const [model, setModel] = useState<string>('');
    // const [dataModel, setDataModel] = useState<string[]>([]);
    const [materialName, setMaterialName] = useState<string>('');
    const [dataMaterial, setDataMaterial] = useState<string[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    // useEffect(() => {
    //     // reset model options when type changes
    //     setDataModel(modelMap[type] || []);
    //     if (!modelMap[type]?.includes(model)) {
    //         setModel('');
    //     }
    // }, [type]);

    const openForm = () => {
        resetForm();
        setIsPopupOpen(true);
    };

    const resetForm = () => {
        setType('');
        setModel('');
        setMaterialName('');
        setEditIndex(null);
        setIsPopupOpen(false);
    };

    const handleAddOrUpdate = () => {
        if (!type || !model || !materialName) return;
        const newItem: Materi = { type, model, name: materialName };

        if (editIndex !== null) {
            const updated = [...material];
            updated[editIndex] = newItem;
            setMaterial(updated);
        } else {
            setMaterial([...material, newItem]);
        }

        resetForm();
    };

    // const handleEdit = (index: number) => {
    //     const item = material[index];
    //     setType(item.type);
    //     setModel(item.model);
    //     setMaterialName(item.name);
    //     setEditIndex(index);
    //     setIsPopupOpen(true);
    // };

    const handleDelete = (index: number) => {
        const updated = material.filter((_, i) => i !== index);
        setMaterial(updated);
        resetForm();
    };

    return (
        <div className='w-full mt-8'>
            {/* Tabel Materi */}
            <div className="mt-4">
                <table className="table w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr>
                            <th className="border p-2 text-center">#</th>
                            <th className="border p-2 text-center">Type</th>
                            <th className="border p-2 text-center">Model</th>
                            <th className="border p-2 text-center">Material</th>
                            <th className="border p-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {material.map((item, idx) => (
                            <tr key={idx} className="text-gray-700">
                                <td className="border p-2 text-center">{idx + 1}</td>
                                <td className="border p-2 text-center">{item.type}</td>
                                <td className="border p-2 text-center">{item.model}</td>
                                <td className="border p-2 text-center">{item.name}</td>
                                <td className="border p-2 flex justify-center gap-2">

                                    <button type="button" onClick={() => handleDelete(idx)} className="p-2 bg-red-100 text-red-600 rounded-full">
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="button"
                    onClick={openForm}
                    className="mt-4 w-full py-2 bg-primary text-white rounded-full flex justify-center items-center gap-2 font-bold"
                >
                    <MdAdd /> Tambah Materi
                </button>
            </div>

            {/* Popup Form */}
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editIndex !== null ? 'Edit Materi' : 'Tambah Materi'}</h2>
                        <div className="space-y-4">
                            <SelectInput
                                label="Type"
                                name="Type"
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    setDataMaterial(classificationMateri[e.target.value] || []);
                                }}
                                options={["Driver", "General", "Mechanic"]}
                            />
                            <SelectInput
                                label="Model"
                                name="model"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                options={["Traga", "Giga", "Elf", "D-Max", "MU-X"]}
                            />
                            <SelectInput
                                label="Material"
                                name="materialName"
                                value={materialName}
                                onChange={(e) => setMaterialName(e.target.value)}
                                options={dataMaterial}
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                            {editIndex !== null && (
                                <button onClick={() => handleDelete(editIndex)} className="px-4 py-2 bg-red-600 text-white rounded">
                                    Hapus
                                </button>
                            )}
                            <button onClick={handleAddOrUpdate} className="px-4 py-2 bg-primary text-white rounded">
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMateri;