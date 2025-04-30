/* DraggableAttachment.tsx */
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableAttachmentProps {
  id: string;
  index: number;
  imageAttached: string;
  imageDescription: string;
}

const DraggableAttachment: React.FC<DraggableAttachmentProps> = ({ id, index, imageAttached, imageDescription }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        onClick={() => onSelect(index)}
        className="border rounded-md shadow-md w-full"
      >
        <img
          src={imageAttached}
          alt="Lampiran"
          className="w-full md:h-56 h-32 object-cover rounded-t-md"
        />
        <p className="py-2 text-center bg-primary rounded-b-md text-white">
          {imageDescription}
        </p>
      </div>
    </div>
  );
};

export default DraggableAttachment;