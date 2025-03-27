// ImageEditorModal.tsx
import React, { useEffect, useRef } from 'react';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import "../styles/ImageEditorModal.css"

interface ImageEditorModalProps {
  imageData: string; // Data URL gambar awal
  onSave: (editedImage: string) => void;
  onCancel: () => void;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ imageData, onSave, onCancel }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Inisialisasi TUI Image Editor dengan gambar awal
    editorInstanceRef.current = new ImageEditor(editorRef.current, {
      includeUI: {
        loadImage: {
          path: imageData,
          name: 'EditedImage'
        },
        theme: {},
        initMenu: 'filter', // Menu awal dapat disesuaikan (misal: crop, text, dll.)
        menuBarPosition: 'bottom'
      },
      // Ukuran editor yang responsif
      cssMaxWidth: window.innerWidth * 0.8,
      cssMaxHeight: window.innerHeight * 0.8,
      selectionStyle: {
        cornerSize: 10,
        rotatingPointOffset: 30
      },
      usageStatistics: false
    });

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
      }
    };
  }, [imageData]);

  const handleSave = () => {
    if (editorInstanceRef.current) {
      // Dapatkan data URL gambar hasil edit
      const editedDataUrl = editorInstanceRef.current.toDataURL();
      onSave(editedDataUrl);
    }
  };

  return (
    <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-40">
      <div className="bg-none h-full w-full rounded shadow-lg relative">
        <div ref={editorRef} className='h-full w-full'></div>
        <div className="flex absolute justify-end mt-2 bottom-4 right-10 z-10">
          <button type='button' onClick={onCancel} className="mr-2 px-4 py-2 bg-gray-400 rounded">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="px-4 py-2 bg-red-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
