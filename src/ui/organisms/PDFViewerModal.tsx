import React from 'react';

interface PDFViewerModalProps {
  pdfUrl: string;
  thumbnail?: boolean;
  only?: boolean;
}

const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ pdfUrl, thumbnail = false, only = false }) => {
  // Define style for embed
  const embedStyle: React.CSSProperties = {
    width: '100%',
    height: thumbnail ? '150px' : '100%',
    border: 'none',
  };

  const embedElement = (
    <embed
      src={pdfUrl}
      type="application/pdf"
      style={embedStyle}
    />
  );

  if (only) {
    // Render only the embed (no wrapper)
    return embedElement;
  }

  // Default wrapper: full container
  return (
    <div className={`${thumbnail ? '' : 'w-full h-full'} overflow-hidden`}>      
      {embedElement}
    </div>
  );
};

export default PDFViewerModal;
