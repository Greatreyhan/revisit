import React, { useState, useEffect } from "react";
import InputField from "../molecules/InputField";
import { MdAdd, MdClose, MdDelete } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";

interface AttachmentItem {
  imageAttached: string;
  imageDescription: string;
}

interface AddAttachmentProps {
  attachments: AttachmentItem[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentItem[]>>;
}

// Fungsi utilitas untuk mengekstrak nama file dari download URL Firebase Storage.
// Pada URL biasanya terdapat bagian "images%2F<filename>" sehingga kita melakukan decoding.
const extractFilename = (url: string): string => {
  const regex = /images%2F([^?]+)/;
  const match = url.match(regex);
  return match ? decodeURIComponent(match[1]) : "";
};

const AddAttachment: React.FC<AddAttachmentProps> = ({ attachments, setAttachments }) => {
  const { uploadImage, deleteImage } = useFirebase();
  const [imageAttached, setImageAttached] = useState<string>("");
  const [imageDescription, setImageDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectIndex, setSelectIndex] = useState<number>(-1);
  const [editDescription, setEditDescription] = useState<string>("");

  // Saat modal preview terbuka, set editDescription dengan nilai deskripsi attachment yang dipilih
  useEffect(() => {
    if (selectIndex !== -1 && attachments[selectIndex]) {
      setEditDescription(attachments[selectIndex].imageDescription);
    }
  }, [selectIndex, attachments]);

  const handleAddAttachment = () => {
    if (imageAttached && imageDescription) {
      const newAttachment = { imageAttached, imageDescription };
      setAttachments([...attachments, newAttachment]);
      setImageAttached("");
      setImageDescription("");
      setIsModalOpen(false);
    }
  };

  const handleDeleteAttachment = async () => {
    if (selectIndex !== -1) {
      const attachmentToDelete = attachments[selectIndex];
      const filename = extractFilename(attachmentToDelete.imageAttached);
      if (filename && deleteImage) {
        await deleteImage(filename);
      }
      const updatedAttachments = attachments.filter((_, index) => index !== selectIndex);
      setAttachments(updatedAttachments);
      setSelectIndex(-1);
    }
  };

  const handleUpdateAttachment = () => {
    if (selectIndex !== -1) {
      const updatedAttachments = attachments.map((item, idx) =>
        idx === selectIndex ? { ...item, imageDescription: editDescription } : item
      );
      setAttachments(updatedAttachments);
      setSelectIndex(-1);
    }
  };

  return (
    <div>
      {/* Modal Preview, Edit, Delete, dan Update */}
      <div
        className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${
          selectIndex === -1 ? "hidden" : "flex"
        } justify-center items-center`}
      >
        {selectIndex !== -1 && attachments[selectIndex] && (
          <div
            className="pb-6 bg-slate-50 rounded-lg flex flex-col w-10/12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center bg-slate-100 rounded-t-xl">
              {/* Field edit untuk deskripsi */}
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="border-none bg-slate-100 ring-0 outline-0 rounded px-4 py-2 h-full"
                placeholder="Masukkan deskripsi gambar"
              />
              <button onClick={() => setSelectIndex(-1)} type="button">
                <MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" />
              </button>
            </div>

            <div className="w-full h-96 flex justify-center items-center">
              <img
                className="object-fill h-full"
                src={attachments[selectIndex].imageAttached}
                alt="Attachment"
              />
            </div>

            <hr className="mt-8" />

            <div className="flex mt-2 gap-3 px-8 pt-4">
              <button
                className="text-rose-800 px-4 py-2 rounded-lg bg-rose-100 flex items-center"
                type="button"
                onClick={handleDeleteAttachment}
              >
                <MdDelete className="text-md mr-1" />
                <p className="text-sm">Delete Image</p>
              </button>

              <button
                className="text-white px-4 py-2 rounded-lg bg-primary flex items-center"
                type="button"
                onClick={handleUpdateAttachment}
              >
                <p className="text-sm">Save Changes</p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* List Attachments */}
      <div className="flex flex-wrap gap-5 mt-4">
        {attachments?.map((attachment, index) => (
          <button
            onClick={() => setSelectIndex(index)}
            type="button"
            key={index}
            className="border rounded-md shadow-md md:w-4/12 w-5/12"
          >
            <img
              src={attachment.imageAttached}
              alt="Lampiran"
              className="w-full md:h-56 h-32 object-cover rounded-t-md"
            />
            <p className="py-2 text-center bg-primary rounded-b-md text-white">
              {attachment.imageDescription}
            </p>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-6 py-2 w-full flex justify-center items-center bg-primary rounded-full text-white font-semibold"
      >
        <MdAdd className="mr-2" />
        Tambah Lampiran
      </button>

      {/* Pop Up untuk tambah attachment */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Tambah Lampiran</h2>

            <div className="flex flex-col w-full">
              <label className="text-xs my-2" htmlFor="image">
                Gambar
              </label>
              <div className="flex items-center gap-x-5">
                {imageAttached && (
                  <a href={imageAttached} target="_blank" rel="noreferrer">
                    <img className="w-16 h-16" src={imageAttached} alt="Lampiran" />
                  </a>
                )}
                <input
                  required
                  onChange={(e) => uploadImage(e, setImageAttached)}
                  name="image"
                  id="image"
                  type="file"
                />
              </div>
            </div>

            <InputField
              label="Deskripsi Gambar"
              name="imageDescription"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="Masukkan deskripsi gambar"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button className="text-primary px-4 py-2 rounded-md" onClick={() => setIsModalOpen(false)}>
                Batal
              </button>
              <button
                className={`text-white px-4 py-2 rounded-md ${imageAttached === "" ? "bg-slate-600" : "bg-primary"}`}
                disabled={imageDescription === ""}
                onClick={handleAddAttachment}
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

export default AddAttachment;
