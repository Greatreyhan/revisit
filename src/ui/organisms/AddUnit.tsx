import React, { useState } from 'react';
import InputField from '../molecules/InputField';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import SelectInput from '../molecules/SelectInput';
import { Unit } from '../interface/Report';

interface AddUnitProps {
    units: Unit[]
    setUnits: (units: Unit[]) => void;
}

const merkData = ["HINO", "ISUZU", "MITSUBISHI", "UD"];

const HINO = [
    "Dutro", "Ranger"
];

const ISUZU = [
    "TRAGA", "NLR", "NLR L", "NMR", "NMR L", "NMR HD 5.8", "NMR HD 6.5",
    "NPS", "NLR B", "NLR B L", "NQR 81", "FRR Q", "FTR P", "FTR S", "FTR T",
    "FVR L D", "FVR P", "FVR Q", "FVR S", "FVR U", "GVR J", "GVR J HP ABS",
    "FVM N", "FVM U", "FVM N HP ABS", "FVM U HP", "FVZ N HP", "FVZ U HP",
    "FVZ L HP MX", "GVZ K HP ABS", "GXZ K ABS"
];

const MITSUBISHI = [
    "Canter", "Fighter", "Fuso", "L300"
];

const UD = [
    "Quester", "Kuzer"
];


const modelMap: Record<string, string[]> = {
    "HINO": HINO,
    "ISUZU": ISUZU,
    "MITSUBISHI": MITSUBISHI,
    "UD": UD,

};


const AddUnit: React.FC<AddUnitProps> = ({ units, setUnits }) => {
    const [trademark, setTrademark] = useState<string>("");
    const [typeUnit, setTypeUnit] = useState<string>("");
    const [dataModel, setDataModel] = useState<string[]>([]);
    const [qtyUnit, setQtyUnit] = useState<string>("");
    const [goodType, setGoodType] = useState<string>("");
    const [route, setRoute] = useState<string>("");
    const [distance, setDistance] = useState<string>("");
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleAddOrUpdateUnit = () => {
        if (trademark && typeUnit && qtyUnit && goodType && route && distance) {
            const newUnit: Unit = { trademark, typeUnit, qtyUnit, goodType, route, distance };

            if (editIndex !== null) {
                const updatedUnits = [...units];
                updatedUnits[editIndex] = newUnit;
                setUnits(updatedUnits);
                setEditIndex(null);
            } else {
                setUnits([...units, newUnit]);
            }
            resetForm();
        }
    };


    const handleEdit = (index: number) => {
        const unit = units[index];
        setTrademark(unit.trademark);
        setTypeUnit(unit.typeUnit);
        setDataModel(modelMap[unit.trademark] || []);
        setQtyUnit(unit.qtyUnit);
        setGoodType(unit.goodType);
        setRoute(unit.route);
        setDistance(unit.distance);
        setEditIndex(index);
        setIsPopupOpen(true);
    };

    const handleDelete = () => {
        if (editIndex !== null) {
            const updatedUnits = units.filter((_, index) => index !== editIndex);
            setUnits(updatedUnits);
            resetForm();
        }
    };
    const resetForm = () => {
        setTrademark("");
        setTypeUnit("");
        setQtyUnit("");
        setGoodType("");
        setRoute("");
        setDistance("");
        setIsPopupOpen(false);
    };

    return (
        <div>
            {/* View */}
            <div className='mt-4'>
                {/* List Unit */}
                <ul>
                    <table className="table p-4 bg-white rounded-lg shadow w-full">
                        <thead>
                            <tr>
                                <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">#</th>
                                <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Merk</th>
                                <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Model</th>
                                <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Qty</th>
                                <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900 md:table-cell hidden">Good</th>
                                <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900 md:table-cell hidden">Route</th>
                                <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900 md:table-cell hidden">Distance (KM)</th>
                                <th className="border p-1.5 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900 w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {units.map((unit, index) => (
                                <tr key={index} className="text-gray-700">
                                    <td className="border p-1.5 dark:border-dark-5 text-center">{index + 1}</td>
                                    <td className="border p-1.5 dark:border-dark-5 text-center">{unit.trademark}</td>
                                    <td className="border p-1.5 dark:border-dark-5 text-center">{unit.typeUnit}</td>
                                    <td className="border p-1.5 dark:border-dark-5 text-center">{unit.qtyUnit}</td>
                                    <td className="border p-1.5 dark:border-dark-5 text-center md:table-cell hidden">{unit.goodType}</td>
                                    <td className="border p-1.5 dark:border-dark-5 text-center md:table-cell hidden">{unit.route}</td>
                                    <td className="border p-1.5 dark:border-dark-5 text-center md:table-cell hidden">{unit.distance}</td>
                                    <td className="border-t p-1.5 flex gap-x-3 justify-around items-center">
                                        <button
                                            type="button"
                                            className="p-2 text-sky-800 rounded-full bg-sky-100"
                                            onClick={() => handleEdit(index)}
                                        >
                                            <MdEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </ul>
                <button
                    type="button" onClick={() => setIsPopupOpen(true)}
                    className="mt-4 px-6 py-2 w-full flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                >
                    <MdAdd className="mr-2" />
                    Tambah Unit
                </button>

            </div>

            {/* Pop Up */}
            {isPopupOpen && (

                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4">Tambah Unit Terlibat</h2>
                        <div className="flex w-full gap-5">
                            <SelectInput label="Merek" name="trademark" value={trademark} onChange={(e) => { setTrademark(e.target.value); setDataModel(modelMap[e.target.value] || []); }} options={merkData} />
                            <SelectInput label="Tipe Unit" name="typeUnit" value={typeUnit} onChange={(e) => setTypeUnit(e.target.value)} options={dataModel} />
                        </div>
                        <div className="flex w-full gap-5">
                            <InputField label="Jumlah Unit" type='number' name="qtyUnit" value={qtyUnit} onChange={(e) => setQtyUnit(e.target.value)} placeholder="Masukkan jumlah unit" />
                            <InputField label="Tipe Barang" name="goodType" value={goodType} onChange={(e) => setGoodType(e.target.value)} placeholder="Masukkan tipe barang" />
                        </div>
                        <InputField label="Rute" name="route" value={route} onChange={(e) => setRoute(e.target.value)} placeholder="Masukkan rute perjalanan" />
                        <InputField type="number" label="Jarak Tempuh (KM)" name="distance" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Masukkan jarak tempuh" />
                        <div className="flex justify-end gap-5 mt-4">
                            <button type="button" className="bg-white text-primary px-4 py-2 rounded-md" onClick={() => resetForm()}>Batal</button>
                            {editIndex !== null && <button type="button" className="text-white bg-primary px-4 py-2 rounded-md flex items-center" onClick={handleDelete}><MdDelete className='mr-1' />Hapus</button>}
                            <button type="button" className="text-white bg-primary px-4 py-2 rounded-md" onClick={handleAddOrUpdateUnit}>Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddUnit;
