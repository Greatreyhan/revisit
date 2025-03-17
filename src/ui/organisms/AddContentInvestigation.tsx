import React, { useState } from "react";
import InputField from "../molecules/InputField";
import { MdAdd, MdEdit } from "react-icons/md";

interface InvestigationItem {
    content: string;
    result: string;
    standard: string;
    judge: string;
}

interface AddContentInvestigationProps {
    investigations: InvestigationItem[];
    setInvestigations: (investigation: InvestigationItem[]) => void;
}

const AddContentInvestigation: React.FC<AddContentInvestigationProps> = ({ investigations, setInvestigations }) => {
    const [content, setContent] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [standard, setStandard] = useState<string>("");
    const [judge, setJudge] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleAddOrEditInvestigation = () => {
        if (content && result && standard && judge) {
            const newInvestigation = { content, result, standard, judge };

            if (editIndex !== null) {
                const updatedInvestigations = [...investigations];
                updatedInvestigations[editIndex] = newInvestigation;
                setInvestigations(updatedInvestigations);
            } else {
                setInvestigations([...investigations, newInvestigation]);
            }

            setContent("");
            setResult("");
            setStandard("");
            setJudge("");
            setIsModalOpen(false);
            setEditIndex(null);
        }
    };

    const handleEdit = (index: number) => {
        setEditIndex(index);
        const inv = investigations[index];
        setContent(inv.content);
        setResult(inv.result);
        setStandard(inv.standard);
        setJudge(inv.judge);
        setIsModalOpen(true);
    };

    const handleDelete = (index: number) => {
        setInvestigations(investigations.filter((_, i) => i !== index));
    };
    return (
        <div>
            {/* View */}
            <div className="mt-4">
                <table className="table p-4 bg-white rounded-lg shadow w-full">
                    <thead>
                        <tr>
                            <th className="border p-1.5 whitespace-nowrap font-normal text-gray-900">#</th>
                            <th className="border p-1.5 whitespace-nowrap font-normal text-gray-900">Isi</th>
                            <th className="border p-1.5 whitespace-nowrap font-normal text-gray-900">Hasil</th>
                            <th className="border p-1.5 whitespace-nowrap font-normal text-gray-900">Standar</th>
                            <th className="border p-1.5 whitespace-nowrap font-normal text-gray-900">Kesimpulan</th>
                            <th className="border p-1.5 whitespace-nowrap font-normal text-gray-900 w-24">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {investigations.map((inv, index) => (
                            <tr key={index} className="text-gray-700">
                                <td className="border p-1.5">{index + 1}</td>
                                <td className="border p-1.5">{inv.content}</td>
                                <td className="border p-1.5">{inv.result}</td>
                                <td className="border p-1.5">{inv.standard}</td>
                                <td className="border p-1.5">{inv.judge}</td>
                                <td className="border p-1.5 flex gap-x-3 justify-around items-center">
                                    <button onClick={() => handleEdit(index)} type="button" className="p-2 text-sky-800 rounded-full bg-sky-100">
                                        <MdEdit />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="button" onClick={() => setIsModalOpen(true)} className="mt-4 px-6 py-2 w-full flex justify-center items-center bg-primary rounded-full text-white font-semibold">
                    <MdAdd className="mr-2" />
                    Tambah Investigasi
                </button>
            </div>

            {/* Pop Up */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-bold mb-4">Tambah Investigasi</h2>

                        <InputField label="Isi Investigasi" name="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Masukkan isi investigasi" />
                        <div className="flex w-full gap-5">
                            <InputField label="Hasil Investigasi" name="result" value={result} onChange={(e) => setResult(e.target.value)} placeholder="Masukkan hasil investigasi" />
                            <InputField label="Standar" name="standard" value={standard} onChange={(e) => setStandard(e.target.value)} placeholder="Masukkan standar" />
                        </div>
                        <InputField label="Kesimpulan" name="judge" value={judge} onChange={(e) => setJudge(e.target.value)} placeholder="Masukkan kesimpulan" />

                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" className="text-primary px-4 py-2 rounded-md" onClick={() => setIsModalOpen(false)}>Batal</button>
                            {editIndex !== null && (
                                <button type="button" className="bg-primary text-white px-4 py-2 rounded-md" onClick={() => { handleDelete(editIndex); setIsModalOpen(false); }}>Hapus</button>
                            )}
                            <button
                                type="button"
                                className="bg-primary text-white px-4 py-2 rounded-md disabled:bg-gray-400"
                                onClick={handleAddOrEditInvestigation}
                                disabled={!content.trim() || !result.trim() || !standard.trim() || !judge.trim()}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AddContentInvestigation;
