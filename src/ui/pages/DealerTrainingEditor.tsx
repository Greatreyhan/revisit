import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../utils/FirebaseContext";
import SelectInput from "../molecules/SelectInput";
import InputField from "../molecules/InputField";
import { DealerData } from "../../utils/masterData";
import AddAttachment from "../organisms/AddAttachment";
import { AttachmentItem } from "../interface/Report";
import AddUnitTraining from "../organisms/AddUnitTraining";
import AddTrainee from "../organisms/AddTrainee";
import { TraineePerson } from "../interface/Training";

const DealerTrainingEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase, user } = useFirebase()
    const navigate = useNavigate();
    const { uid,id } = useParams<{ uid:string, id: string }>();

    // State untuk mengecek apakah data sudah diubah
    const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
    //------------------------
    // Data Customer
    const [trainerName, setTrainerName] = useState<string>("");
    const [dealer, setDealer] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [unit, setUnit] = useState<string[]>([]);
    const [trainee, setTrainee] = useState<TraineePerson[]>([])
    const [attachments, setAttachments] = useState<AttachmentItem[]>([]);

    // Fungsi untuk mendeteksi perubahan input
    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setter(e.target.value);
        setIsDataChanged(true); // Set bahwa ada perubahan data
    };

    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        const newData = {
            trainerName,
            dealer,
            customerName,
            startDate,
            endDate,
            title,
            description,
            unit,
            trainee,
            attachments
        };

        try {
            await saveToDatabase(`training/${uid}/${id || Date.now()}`, newData);
            setIsDataChanged(false); 
            navigate("/training"); 
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };
    useEffect(() => {
        if (id) {
            getFromDatabase(`training/${uid}/${id}`).then((data) => {
                if (data) {
                    setTrainerName(data.trainerName || "");
                    setDealer(data.dealer || "");
                    setCustomerName(data.customerName || "");
                    setStartDate(data.startDate || "");
                    setEndDate(data.endDate || "");
                    setTitle(data.title || "");
                    setDescription(data.description || "");
                    setUnit(data.unit || []);
                    setTrainee(data.trainee || []);
                    // Attachment
                    setAttachments(data.attachments || []);
                }
            });
        }
    }, [id, user?.uid]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDataChanged) {
                event.preventDefault();
                event.returnValue = "Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar?";
            }
        };

        const handleBackButton = () => {
            if (isDataChanged) {
                const confirmLeave = window.confirm("Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?");
                if (!confirmLeave) {
                    // Dorong kembali state agar tetap di halaman saat tombol Back ditekan
                    window.history.pushState(null, "", window.location.href);
                }
            }
        };

        // Tambahkan state baru ke history agar kita bisa mengendalikan navigasi
        window.history.pushState(null, "", window.location.href);

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [isDataChanged]);


    return (
        <div className="App overflow-x-hidden">
            <div className="pt-16">

                <form className="md:w-10/12 w-11/12 flex flex-col mx-auto my-4 justify-around items-center" onSubmit={handleSendData}>

                    {/* General Information */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Report Information</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField disabled={true} label="Trainer Name" type="text" name="trainerName" value={trainerName} onChange={handleChange(setTrainerName)} placeholder="Nama Trainer" />
                            <SelectInput
                                required={true}
                                disabled={true} 
                                label="Dealer"
                                name="dealer"
                                value={dealer}
                                onChange={handleChange(setDealer)}
                                options={DealerData}
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField disabled={true} label="Start Date" type="datetime-local" name="startDate" value={startDate} onChange={handleChange(setStartDate)} placeholder="Start Date" />
                            <InputField disabled={true} label="End Date" type="datetime-local" name="endDate" value={endDate} onChange={handleChange(setEndDate)} placeholder="Explain Date" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField disabled={true} label="Customer Name" type="text" name="customerName" value={customerName} onChange={handleChange(setCustomerName)} placeholder="Nama Customer" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField type="text" disabled={true} label="Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                            <InputField type="text" disabled={true} label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <AddUnitTraining unit={unit} setUnit={setUnit} />
                        </div>
                        {/* Trainee */}
                        <div className="w-full py-8 rounded-lg my-4 bg-slate-100">
                            <h2 className="font-semibold">Trainee Person</h2>
                            <AddTrainee trainees={trainee} setTrainees={setTrainee} />
                        </div>
                        {/* Attachment */}
                        <div className="w-full py-8 rounded-lg my-4 bg-slate-100">
                            <h2 className="font-semibold">Training Documentation</h2>
                            <AddAttachment disabled={true} attachments={attachments} setAttachments={setAttachments} />
                        </div>
                    </div>
                    <div className="fixed md:hidden block bottom-5 right-5">
                        <button
                            type="submit"
                            className="mt-4 p-3 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                        >
                            <BiSave className="text-2xl" />
                        </button>
                    </div>
                    <div className="flex w-full justify-end items-center gap-x-5">
                        <Link
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary rounded-full font-semibold"
                            to="/dealer/training"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DealerTrainingEditor;