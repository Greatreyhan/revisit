import React, { useState } from "react";
import InputField from "../molecules/InputField";
import { MdAdd } from "react-icons/md";
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

    return (
        <div>
            {/* List Attachments */}
            <div className="flex gap-5 mt-4">
                {attachments.map((attachment, index) => (
                    <div key={index} className="border rounded-md shadow-md w-4/12">
                        <img src={attachment.imageAttached} alt="Lampiran" className="w-full h-56 object-cover rounded-md" />
                        <p className="py-2 text-center bg-primary rounded-b text-white">{attachment.imageDescription}</p>
                    </div>
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
