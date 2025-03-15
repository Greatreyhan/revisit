import React, { useState } from "react";
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

const AddAttachment: React.FC<AddAttachmentProps> = ({ attachments, setAttachments }) => {
    const { uploadImage } = useFirebase();
    const [imageAttached, setImageAttached] = useState<string>("");
    const [imageDescription, setImageDescription] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectIndex, setSelectIndex] = useState<number>(-1)

    const handleAddAttachment = () => {
        if (imageAttached && imageDescription) {
            const newAttachment = { imageAttached, imageDescription };
            setAttachments([...attachments, newAttachment]); // Update parent state

            // Reset input fields
            setImageAttached("");
            setImageDescription("");
            setIsModalOpen(false);
        }
    };

    const handleDeleteAttachment = () => {
        if (selectIndex !== -1) {
            const updatedAttachments = attachments.filter((_, index) => index !== selectIndex);
            setAttachments(updatedAttachments);
            setSelectIndex(-1); // Tutup modal setelah menghapus
        }
    };

    return (
        <div>
            {/* Show Images */}
            <div onClick={() => setSelectIndex(-1)} className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${selectIndex == -1 ? "hidden" : "flex"} justify-center items-center`}>
                <div className={`pb-6 bg-slate-50 rounded-lg flex flex-col w-10/12`}>
                    <div className="relative">
                        <div className="flex justify-between items-center bg-slate-100 rounded-t-xl">
                            <h2 className="text-xl px-6">{attachments[selectIndex]?.imageDescription}</h2>
                            <button onClick={() => setSelectIndex(-1)} type="button"><MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" /></button>
                        </div>

                        <div className="w-full h-96 flex justify-center items-center" >
                            <img className="object-fill h-full" src={attachments[selectIndex]?.imageAttached} />
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

                        </div>
                    </div>


                </div>
            </div>

            {/* List Attachments */}
            <div className="flex flex-wrap gap-5 mt-4">
                {attachments.map((attachment, index) => (
                    <button onClick={() => setSelectIndex(index)} type="button" key={index} className="border rounded-md shadow-md md:w-4/12 w-5/12">
                        <img src={attachment.imageAttached} alt="Lampiran" className="w-full md:h-56 h-32 object-cover rounded-t-md" />
                        <p className="py-2 text-center bg-primary rounded-b-md text-white">{attachment.imageDescription}</p>
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

            {/* Pop Up */}
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
                                        <img className="w-16 h-16" src={imageAttached} alt="Article" />
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

                        <InputField label="Deskripsi Gambar" name="imageDescription" value={imageDescription} onChange={(e) => setImageDescription(e.target.value)} placeholder="Masukkan deskripsi gambar" />

                        <div className="flex justify-end gap-2 mt-4">
                            <button className="text-primary px-4 py-2 rounded-md" onClick={() => setIsModalOpen(false)}>Batal</button>
                            <button className="bg-primary text-white px-4 py-2 rounded-md" onClick={handleAddAttachment}>Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAttachment;
