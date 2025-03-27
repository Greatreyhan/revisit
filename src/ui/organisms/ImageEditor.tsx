import React, { useEffect, useRef } from 'react';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';

const ImageEditorComponent: React.FC = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const editorInstance = new ImageEditor(editorRef.current, {
      includeUI: {
        loadImage: {
          path: 'https://via.placeholder.com/500', // Ganti dengan path gambar Anda
          name: 'SampleImage'
        },
        theme: {},
        initMenu: 'filter',
        menuBarPosition: 'bottom'
      },
      // Menggunakan ukuran fullscreen berdasarkan window dimensions
      cssMaxWidth: window.innerWidth,
      cssMaxHeight: window.innerHeight,
      selectionStyle: {
        cornerSize: 10,
        rotatingPointOffset: 30
      },
      usageStatistics: false // Nonaktifkan statistik penggunaan (opsional)
    });

    return () => {
      editorInstance.destroy();
    };
  }, []);

  return (
    // Container luar mengisi viewport penuh
    <div className='w-screen h-screen fixed top-0 left-0'>
      {/* Inline style untuk menyembunyikan logo */}
      <style>{`
        .tui-image-editor-header-logo {
          display: none;
        }
      `}</style>
      <div ref={editorRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default ImageEditorComponent;
