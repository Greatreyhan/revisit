// DraggableInvestigation.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdEdit } from 'react-icons/md';

export interface DraggableInvestigationProps {
  id: string;
  index: number;
  content: string;
  result: string;
  standard: string;
  judge: string;
  onEdit: (index: number) => void;
}

const DraggableInvestigation: React.FC<DraggableInvestigationProps> = ({
  id,
  index,
  content,
  result,
  standard,
  judge,
  onEdit,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    // pastikan baris tabel tetap full-width saat di-drag
    display: 'table-row',
    cursor: 'grab',
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="text-gray-700 bg-white"
      {...attributes}
      {...listeners}
    >
      <td className="border p-1.5">{index + 1}</td>
      <td className="border p-1.5">{content}</td>
      <td className="border p-1.5">{result}</td>
      <td className="border p-1.5">{standard}</td>
      <td className="border p-1.5">{judge}</td>
      <td className="border p-1.5 flex gap-x-3 justify-around items-center w-24">
        <button
          onClick={() => onEdit(index)}
          type="button"
          className="p-2 text-sky-800 rounded-full bg-sky-100"
        >
          <MdEdit />
        </button>
      </td>
    </tr>
  );
};

export default DraggableInvestigation;
