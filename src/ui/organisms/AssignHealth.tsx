import { useEffect, useState } from "react";
import { IoMdSettings, IoMdRemoveCircle } from "react-icons/io";
import { useFirebase } from "../../utils/FirebaseContext";
import { HealthReportData } from "../interface/Health";

interface AssignHealthProps {
    healthID: string[];
    setHealthID: (nexthealthIDs: string[]) => void;
}

const AssignHealth: React.FC<AssignHealthProps> = ({ healthID, setHealthID }) => {
    const { getFromDatabase, user } = useFirebase();
    const [dataReport, setDataReport] = useState<{ [key: string]: HealthReportData }>({});
    const [keys, setKeys] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelected, setTempSelected] = useState<string[]>([]);

    useEffect(() => {
        if (!user?.uid) return;
        getFromDatabase(`health/${user.uid}`).then((data) => {
            if (data) {
                const k = Object.keys(data);
                setKeys(k);
                setDataReport(data);
            }
        });
    }, [getFromDatabase, user?.uid]);

    const openModal = () => {
        setTempSelected(healthID);
        setIsModalOpen(true);
    };

    const handleToggleTemp = (id: string) => {
        setTempSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        setHealthID(tempSelected);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleRemove = (id: string) => {
        setHealthID(healthID.filter((rid) => rid !== id));
    };

    return (
        <>
            <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                <div className="flex justify-between">
                    <h2 className="font-semibold mb-4">Health Report</h2>
                    <button type="button"
                        onClick={openModal}
                        className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded"
                    >
                        <IoMdSettings /> Select Reports
                    </button>
                </div>

                <div className="flex justify-center items-center overflow-x-auto">
                    <table className="table p-4 bg-white rounded-lg shadow min-w-[600px]">
                        <thead>
                            <tr className="md:text-md text-sm bg-slate-50 font-bold">
                                <th className="border p-4">#</th>
                                <th className="border p-4">Date</th>
                                <th className="border p-4">Type</th>
                                <th className="border p-4">Rear Body Type</th>
                                <th className="border p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {healthID.map((key, i) => (
                                <tr key={key} className="text-gray-700 md:text-md text-sm">
                                    <td className="border p-4">{i + 1}</td>
                                    <td className="border p-4">{dataReport[key]?.explainDate}</td>
                                    <td className="border p-4">{dataReport[key]?.typeUnit}</td>
                                    <td className="border p-4">{dataReport[key]?.rearBodyType}</td>
                                    <td className="border p-4 flex justify-center">
                                        <button type="button"
                                            onClick={() => handleRemove(key)}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded"
                                        >
                                            <IoMdRemoveCircle /> Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {healthID.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center p-4 text-gray-500">
                                        No reports selected.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl p-6">
                        <h3 className="text-xl font-semibold mb-4">Select Reports</h3>
                        <div className="max-h-64 overflow-y-auto space-y-2 mb-6">
                            {keys.map((key) => (
                                <label key={key} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={tempSelected.includes(key)}
                                        onChange={() => handleToggleTemp(key)}
                                        className="form-checkbox"
                                    />
                                    <span>
                                        {dataReport[key]?.customerName}
                                    </span>
                                </label>
                            ))}
                            {keys.length === 0 && <p className="text-gray-500">No reports available.</p>}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded">
                                Cancel
                            </button>
                            <button type="button" onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AssignHealth;
