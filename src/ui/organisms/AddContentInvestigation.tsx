import React, { useState } from "react";
import InputField from "../molecules/InputField";
import { MdAdd } from "react-icons/md";
import SelectInput from "../molecules/SelectInput";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableInvestigation from "./DraggableInvestigation";

export interface InvestigationItem {
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

  // DnD-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    const newOrder = arrayMove(investigations, oldIndex, newIndex);
    setInvestigations(newOrder);
  };

  const handleAddOrEditInvestigation = () => {
    if (content && result && standard && judge) {
      const newInvestigation: InvestigationItem = { content, result, standard, judge };

      if (editIndex !== null) {
        const updated = [...investigations];
        updated[editIndex] = newInvestigation;
        setInvestigations(updated);
      } else {
        setInvestigations([...investigations, newInvestigation]);
      }

      resetForm();
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
    resetForm();
  };

  const resetForm = () => {
    setContent("");
    setResult("");
    setStandard("");
    setJudge("");
    setIsModalOpen(false);
    setEditIndex(null);
  };

  return (
    <div>
      {/* View */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
            <SortableContext items={investigations.map((_, idx) => idx.toString())} strategy={verticalListSortingStrategy}>
              <tbody>
                {investigations.map((inv, index) => (
                  <DraggableInvestigation
                    key={index}
                    id={index.toString()}
                    index={index}
                    content={inv.content}
                    result={inv.result}
                    standard={inv.standard}
                    judge={inv.judge}
                    onEdit={handleEdit}
                  />
                ))}
              </tbody>
            </SortableContext>
          </table>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-6 py-2 w-full flex justify-center items-center bg-primary rounded-full text-white font-semibold"
          >
            <MdAdd className="mr-2" />
            Tambah Investigasi
          </button>
        </div>
      </DndContext>

      {/* Pop Up */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Tambah Investigasi</h2>

            <InputField label="Isi Investigasi" name="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Masukkan isi investigasi" />
            <div className="flex w-full gap-5">
              <InputField label="Hasil Investigasi" name="result" value={result} onChange={e => setResult(e.target.value)} placeholder="Masukkan hasil investigasi" />
              <InputField label="Standar" name="standard" value={standard} onChange={e => setStandard(e.target.value)} placeholder="Masukkan standar" />
            </div>
            <SelectInput label="Kesimpulan" name="judge" value={judge} onChange={e => setJudge(e.target.value)} options={["OK", "NG", "Not Confirmed"]} />
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="text-primary px-4 py-2 rounded-md" onClick={resetForm}>
                Batal
              </button>
              {editIndex !== null && (
                <button
                  type="button"
                  className="bg-primary text-white px-4 py-2 rounded-md"
                  onClick={() => handleDelete(editIndex)}
                >
                  Hapus
                </button>
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
