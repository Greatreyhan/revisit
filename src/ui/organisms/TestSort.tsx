// TestSort.tsx
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableAttachment from './DraggableAttachment';
import { nanoid } from 'nanoid';

interface Item {
  id: string;
  imageAttached: string;
  imageDescription: string;
  imageId: number;
}

const initialData: Omit<Item, 'id'>[] = [
  {
    imageAttached: "https://firebasestorage.googleapis.com/v0/b/wsucompro.appspot.com/o/images%2F1745161257194.png?alt=media&token=1e3e8f2f-5a94-4dbe-a9bd-78d0e582a99d",
    imageDescription: "Discussion with the manager",
    imageId: 1745161257194,
  },
  {
    imageAttached: "https://firebasestorage.googleapis.com/v0/b/wsucompro.appspot.com/o/images%2F1745195014451.png?alt=media&token=666a2cf5-dbff-4c43-a0f8-7735ba8044bc",
    imageDescription: "Customer's Pool",
    imageId: 1745195014451,
  },
  {
    imageAttached: "https://firebasestorage.googleapis.com/v0/b/wsucompro.appspot.com/o/images%2F1745195058330.png?alt=media&token=bd42ff48-911a-439c-af9d-64c333d41a62",
    imageDescription: "One of customer's Isuzu unit",
    imageId: 1745195058330,
  },
  {
    imageAttached: "https://firebasestorage.googleapis.com/v0/b/wsucompro.appspot.com/o/images%2F1745195093239.png?alt=media&token=705f9a9e-b2a6-4798-8fb1-8427c157bcb1",
    imageDescription: "Unit with one filter",
    imageId: 1745195093239,
  },
  {
    imageAttached: "https://firebasestorage.googleapis.com/v0/b/wsucompro.appspot.com/o/images%2F1745195130806.png?alt=media&token=17d95b76-94d5-4da2-a5cd-ae9537b5db6e",
    imageDescription: "Tire Uneven",
    imageId: 1745195130806,
  },
  {
    imageAttached: "https://firebasestorage.googleapis.com/v0/b/wsucompro.appspot.com/o/images%2F1745195228282.png?alt=media&token=64a0c33d-315d-460c-b6d8-d860685430a5",
    imageDescription: "Unit VIN",
    imageId: 1745195228282,
  },
];

const TestSort: React.FC = () => {
  const [items, setItems] = useState<Item[]>(() =>
    initialData.map(item => ({ ...item, id: nanoid() }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems(oldItems => {
      const oldIndex = oldItems.findIndex(i => i.id === active.id);
      const newIndex = oldItems.findIndex(i => i.id === over.id);
      return arrayMove(oldItems, oldIndex, newIndex);
    });
  };

  // const handleEdit = (index: number) => {
  //   console.log('Edit item at', index);
  //   // implement your edit logic here
  // };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="mt-4">
        <SortableContext
          items={items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-4 w-full">
            {items.map((item, index) => (
              <DraggableAttachment
                key={item.id}
                id={item.id}
                index={index}
                imageAttached={item.imageAttached}
                imageDescription={item.imageDescription}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default TestSort;