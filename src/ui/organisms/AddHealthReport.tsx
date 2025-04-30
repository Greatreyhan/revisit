import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose, MdDelete } from 'react-icons/md';
import InputField from '../molecules/InputField';
import { useFirebase } from '../../utils/FirebaseContext';
import PDFViewerModal from './PDFViewerModal';
import { PdfAttachmentItem } from '../interface/PDF';

interface AddHealthReportProps {
  disabled?: boolean;
  attachments: PdfAttachmentItem[];
  setAttachments: React.Dispatch<React.SetStateAction<PdfAttachmentItem[]>>;
}

// Extract filename from Firebase Storage URL
const extractPdfFilename = (url: string): string => {
  const regex = /pdf%2F([^?]+)/;
  const match = url.match(regex);
  return match ? decodeURIComponent(match[1]) : '';
};

const AddHealthReport: React.FC<AddHealthReportProps> = ({ disabled = false, attachments, setAttachments }) => {
  const { uploadPdfWithPath, deletePdfWithPath, user } = useFirebase();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfDescription, setPdfDescription] = useState<string>('');
  const [pdfId, setPdfId] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectIndex, setSelectIndex] = useState<number>(-1);
  const [editDescription, setEditDescription] = useState<string>('');

  useEffect(() => {
    if (selectIndex !== -1 && attachments[selectIndex]) {
      setEditDescription(attachments[selectIndex].pdfDescription);
    }
  }, [selectIndex, attachments]);

  const handleAddReport = () => {
    if (pdfUrl && pdfDescription && pdfId) {
      setAttachments([...attachments, { pdfUrl, pdfDescription, pdfId }]);
      setPdfUrl('');
      setPdfDescription('');
      setPdfId(0);
      setIsModalOpen(false);
    }
  };

  const handleDeleteReport = async () => {
    if (selectIndex !== -1) {
      const item = attachments[selectIndex];
      const filename = extractPdfFilename(item.pdfUrl);
      if (filename) {
        await deletePdfWithPath(filename, item.pdfId?.toString() ?? '');
      }
      setAttachments(attachments.filter((_, idx) => idx !== selectIndex));
      setSelectIndex(-1);
    }
  };

  const handleUpdateReport = () => {
    if (selectIndex !== -1) {
      setAttachments(attachments.map((item, idx) =>
        idx === selectIndex ? { ...item, pdfDescription: editDescription } : item
      ));
      setSelectIndex(-1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    uploadPdfWithPath(e, setPdfUrl, setPdfId, user?.uid ?? '');
  };

  return (
    <div>
      {/* Modal for viewing, updating, deleting */}
      <div className={`fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 ${selectIndex === -1 ? 'hidden' : 'flex'}`} onClick={() => setSelectIndex(-1)}>
        {selectIndex !== -1 && attachments[selectIndex] && (
          <div className="bg-white w-10/12 p-4 rounded-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <InputField
                label="Deskripsi Laporan"
                name="editDescription"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Masukkan deskripsi laporan"
              />
              <button onClick={() => setSelectIndex(-1)}><MdClose size={24} /></button>
            </div>
            <div className="h-96 mt-2">
              <PDFViewerModal pdfUrl={attachments[selectIndex].pdfUrl} />
            </div>
            {!disabled?
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded" onClick={handleDeleteReport}>
                <MdDelete className="mr-1" /> Hapus
              </button>
              <button type="button" className="px-4 py-2 bg-primary text-white rounded" onClick={handleUpdateReport}>
                Simpan
              </button>
            </div>
            :null}
          </div>
        )}
      </div>

      {/* List of reports */}
      <div className="flex flex-wrap gap-4">
        {attachments.map((item, idx) => (
          <button type="button" key={idx} onClick={() => setSelectIndex(idx)} className="border rounded shadow-md w-4/12">
            <PDFViewerModal pdfUrl={item.pdfUrl} thumbnail only />
            <p className="p-2 bg-primary text-white text-center rounded-b">
              {item.pdfDescription}
            </p>
          </button>
        ))}
      </div>

      {/* Button add */}
      {!disabled && (
        <button type="button" className="mt-4 px-6 py-2 bg-primary text-white rounded-full flex items-center" onClick={() => setIsModalOpen(true)}>
          <MdAdd className="mr-2" /> Tambah Laporan Kesehatan
        </button>
      )}

      {/* Modal add */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white w-96 p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Tambah Laporan Kesehatan</h2>
            <div className="mb-4">
              <label htmlFor="pdf" className="block text-sm mb-2">File PDF</label>
              <input id="pdf" type="file" accept="application/pdf" onChange={handleFileChange} />
            </div>
            <InputField
              label="Deskripsi Laporan"
              name="pdfDescription"
              value={pdfDescription}
              onChange={e => setPdfDescription(e.target.value)}
              placeholder="Masukkan deskripsi laporan"
            />
            {!disabled ?
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" className="px-4 py-2 text-gray-700" onClick={() => setIsModalOpen(false)}>Batal</button>
              <button type="button" className="px-4 py-2 bg-primary text-white rounded" disabled={!pdfUrl || !pdfDescription} onClick={handleAddReport}>Simpan</button>
            </div>
            :
            null}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddHealthReport;
