// AddAttachment.tsx
import React, { useState, useEffect } from "react";
import InputField from "../molecules/InputField";
import { MdAdd, MdClose, MdDelete } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import ImageEditorModal from "./ImageEditorModal"; // Pastikan path ini sesuai

interface AttachmentItem {
  imageAttached: string;
  imageDescription: string;
  imageId?: number;
}

interface AddAttachmentProps {
  disabled?: boolean;
  attachments: AttachmentItem[];
  setAttachments: React.Dispatch<React.SetStateAction<AttachmentItem[]>>;
}

const extractFilename = (url: string): string => {
  const regex = /images%2F([^?]+)/;
  const match = url.match(regex);
  return match ? decodeURIComponent(match[1]) : "";
};

const AddAttachment: React.FC<AddAttachmentProps> = ({ disabled=false, attachments, setAttachments }) => {
  const { uploadEditedImageWithPath, deleteImageWithPath, user } = useFirebase();
  const [imageAttached, setImageAttached] = useState<string>("");
  const [imageDescription, setImageDescription] = useState<string>("");
  const [imageId, setImageId] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectIndex, setSelectIndex] = useState<number>(-1);
  const [editDescription, setEditDescription] = useState<string>("");

  // State untuk Image Editor Modal
  const [showEditorModal, setShowEditorModal] = useState<boolean>(false);
  const [editorImage, setEditorImage] = useState<string>("");

  useEffect(() => {
    if (selectIndex !== -1 && attachments[selectIndex]) {
      setEditDescription(attachments[selectIndex].imageDescription);
    }
  }, [selectIndex, attachments]);

  const handleAddAttachment = () => {
    if (imageAttached && imageDescription && imageId) {
      const newAttachment = { imageAttached, imageDescription, imageId };
      setAttachments([...attachments, newAttachment]);
      setImageAttached("");
      setImageDescription("");
      setImageId(0);
      setIsModalOpen(false);
    }
  };

  const handleDeleteAttachment = async () => {
    if (selectIndex !== -1) {
      const attachmentToDelete = attachments[selectIndex];
      const filename = extractFilename(attachmentToDelete.imageAttached);
      if (filename && deleteImageWithPath) {
        await deleteImageWithPath(filename, attachmentToDelete?.imageId?.toString() ?? "");
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

  // Handler untuk file input: membaca file dan membuka image editor
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Buka modal image editor dengan gambar yang dipilih
        setEditorImage(result);
        setShowEditorModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid dataURL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Callback dari ImageEditorModal ketika pengguna menyimpan hasil edit
  const handleEditorSave = async (editedImage: string) => {
    setShowEditorModal(false);

    // Konversi Data URL ke File
    const editedFile = dataURLtoFile(editedImage, "edited-image.png");

    // Panggil fungsi upload dengan file hasil edit
    // Pastikan fungsi uploadEditedImageWithPath telah disesuaikan untuk menerima File
    await uploadEditedImageWithPath(editedFile, (downloadURL: string) => {
      // Setelah upload berhasil, update state imageAttached dan imageId
      setImageAttached(downloadURL);
    }, (newImageId: number) => {
      setImageId(newImageId);
    }, user?.uid ?? "");

    // Jika upload berhasil, kamu bisa langsung menambahkan attachment
  };

  return (
    <div>
      {/* Modal Preview untuk Edit, Delete, dan Update Lampiran */}
      <div
        className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 z-50 ${selectIndex === -1 ? "hidden" : "flex"
          } justify-center items-center`}
      >
        {selectIndex !== -1 && attachments[selectIndex] && (
          <div
            className="pb-6 bg-slate-50 rounded-lg flex flex-col w-10/12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center bg-slate-100 rounded-t-xl">
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

      {/* List Lampiran */}
      <div className="flex flex-wrap mt-4 w-full">

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

      {!disabled ?

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="mt-4 px-6 py-2 w-full flex justify-center items-center bg-primary rounded-full text-white font-semibold"
      >
        <MdAdd className="mr-2" />
        Tambah Lampiran
      </button>
      :<></>
    }

      {/* Pop Up untuk tambah attachment */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Tambah Lampiran</h2>

            <div className="w-full h-64 flex justify-center">
              {imageAttached && (
                <a href={imageAttached} target="_blank" rel="noreferrer">
                  <img className="w-full h-full object-contain" src={imageAttached} alt="Lampiran" />
                </a>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label className="text-xs my-2" htmlFor="image">
                Gambar
              </label>
              <div className="flex items-center gap-x-5">
                <input
                  required
                  onChange={handleFileChange}
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
                type="button"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditorModal && (
        <ImageEditorModal
          imageData={editorImage}
          onSave={handleEditorSave}
          onCancel={() => setShowEditorModal(false)}
        />
      )}
    </div>
  );
};

export default AddAttachment;
