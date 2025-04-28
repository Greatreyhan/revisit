// DraggableAttachment.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdEdit } from 'react-icons/md';

export interface DraggableAttachmentProps {
  id: string;
  index: number;
  imageAttached: string;
  imageDescription: string;
  standard: string;
  imageId: number;
  onEdit: (index: number) => void;
}

const DraggableAttachment: React.FC<DraggableAttachmentProps> = ({
  id,
  index,
  imageAttached,
  imageDescription,
  standard,
  imageId,
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

      {/* Isi: deskripsi gambar */}
      <td className="border p-1.5 whitespace-nowrap">
        {imageDescription}
      </td>

      {/* Hasil: thumbnail gambar */}
      <td className="border p-1.5">
        <img
          src={imageAttached}
          alt={imageDescription}
          className="w-24 h-auto rounded"
        />
      </td>

      {/* Standar */}
      <td className="border p-1.5 whitespace-nowrap">
        {standard}
      </td>

      {/* Kesimpulan: menampilkan imageId sebagai placeholder */}
      <td className="border p-1.5 whitespace-nowrap">
        {imageId}
      </td>

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

export default DraggableAttachment;
