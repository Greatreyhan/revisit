import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../utils/FirebaseContext";
import SelectInput from "../molecules/SelectInput";
import InputField from "../molecules/InputField";
import { DealerData } from "../../utils/masterData";
import AddAttachment from "../organisms/AddAttachment";
import { AttachmentItem } from "../interface/Report";
import AddTrainee from "../organisms/AddTrainee";
import { TraineePerson } from "../interface/Training";
import AddMateri from "../organisms/AddMateri";
import { Materi } from "../interface/Materi";
import AddAbsensi from "../organisms/AddAbsensi";
import { PdfAttachmentItem } from "../interface/PDF";

const ProfileTrainingEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase, user } = useFirebase()
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
    // Data Customer
    const [trainerName, setTrainerName] = useState<string>("");
    const [dealer, setDealer] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [customerType, setCustomerType] = useState<string>("");
    const [unit, setUnit] = useState<string[]>([]);
    const [trainee, setTrainee] = useState<TraineePerson[]>([])
    const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
    const [material, setMaterial] = useState<Materi[]>([])
    const [customers, setCustomers] = useState<any[]>([]);
    const [pdfAttachments, setPdfAttachments] = useState<PdfAttachmentItem[]>([]);
    const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false)
    const [customerId, setCustomerId] = useState<string>("")

    // Fungsi untuk mendeteksi perubahan input
    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setter(e.target.value);
        setIsDataChanged(true);
    };

    function formatList(items: Materi[]) {
        const parts = items.map(item =>
            `${item.name} for ${item.model}`
        );

        if (parts.length === 0) return '';
        if (parts.length === 1) return parts[0];

        const allButLast = parts.slice(0, -1).join(', ');
        const last = parts[parts.length - 1];
        return `${allButLast}, and ${last}`;
    }

    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        const newData = {
            trainerName,
            dealer,
            customerName,
            startDate,
            endDate,
            customerType,
            title: formatList(material) || "",
            unit,
            trainee,
            attachments,
            material,
            customerId,
            pdfAttachments
        };

        try {
            await saveToDatabase(`training/${user?.uid}/${id || Date.now()}`, newData);
            setIsDataChanged(false);
            navigate("/training");
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    useEffect(() => {
        if (user) {
            getFromDatabase(`customer/${user.uid}`).then((data) => {
                if (data) {
                    const list = Object.entries(data).map(([key, val]: any) => ({ id: key, ...val }));
                    setCustomers(list);
                }
            });
        }
    }, [user]);


    useEffect(() => {
        if (id) {
            getFromDatabase(`training/${user?.uid}/${id}`).then((data) => {
                if (data) {
                    setTrainerName(data.trainerName || "");
                    setDealer(data.dealer || "");
                    setCustomerName(data.customerName || "");
                    setStartDate(data.startDate || "");
                    setEndDate(data.endDate || "");
                    setCustomerType(data.customerType || "");
                    setAttachments(data.setAttachments || "")
                    setUnit(data.unit || []);
                    setTrainee(data.trainee || []);
                    setAttachments(data.attachments || []);
                    setCustomerId(data.customerId || []);

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
                    window.history.pushState(null, "", window.location.href);
                }
            }
        };

        window.history.pushState(null, "", window.location.href);

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [isDataChanged]);

    const handleSelectCustomer = (cust: any) => {
        setCustomerName(cust.customerName || "");
        setDealer(cust.dealer || "");
        setCustomerType(cust.typeCustomer || "")
        setIsDataChanged(true);
        setShowCustomerModal(false);
        setCustomerId(cust.id)
    };


    return (
        <div className="App overflow-x-hidden">
            {showCustomerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-3/4 max-w-lg p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Pilih Customer yang Sudah Ada</h3>
                        <ul className="max-h-60 overflow-y-auto">
                            {customers.map((c) => (
                                <li
                                    key={c.id}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleSelectCustomer(c)}
                                >
                                    {c.customerName}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded-full"
                                onClick={() => setShowCustomerModal(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="pt-16">

                <form className="md:w-10/12 w-11/12 flex flex-col mx-auto my-4 justify-around items-center" onSubmit={handleSendData}>

                    {/* General Information */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Report Information</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Trainer Name" type="text" name="trainerName" value={trainerName} onChange={handleChange(setTrainerName)} placeholder="Nama Trainer" />
                            <SelectInput
                                required={true}
                                label="Dealer"
                                name="dealer"
                                value={dealer}
                                onChange={handleChange(setDealer)}
                                options={DealerData}
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Start Date" type="datetime-local" name="startDate" value={startDate} onChange={handleChange(setStartDate)} placeholder="Start Date" />
                            <InputField label="End Date" type="datetime-local" name="endDate" value={endDate} onChange={handleChange(setEndDate)} placeholder="Explain Date" />
                        </div>
                        <div className="w-full gap-5 mt-8 flex items-center justify-between">
                            <h2 className="font-semibold">Customer Information</h2>
                            <button
                                type="button"
                                className="px-4 py-2 bg-primary text-white rounded-full font-semibold"
                                onClick={() => setShowCustomerModal(true)}
                            >
                                Select Customer
                            </button>
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Customer Name" type="text" name="customerName" value={customerName} onChange={handleChange(setCustomerName)} placeholder="Nama Customer" />
                            <SelectInput label="Customer Type" name="customerType" value={customerType} onChange={handleChange(setCustomerType)} options={["Premium", "Fleet", "Retail", "Other"]} />
                        </div>

                        <div className="md:flex w-full gap-5">
                            <AddMateri material={material} setMaterial={setMaterial} />
                        </div>
                        {/* Trainee */}
                        <div className="w-full py-8 rounded-lg my-4 bg-slate-100">
                            <h2 className="font-semibold">Trainee Person</h2>
                            <AddTrainee trainees={trainee} setTrainees={setTrainee} />
                        </div>
                        {/* Attachment */}
                        <div className="w-full py-8 rounded-lg my-4 bg-slate-100">
                            <h2 className="font-semibold">Training Documentation</h2>
                            <AddAttachment attachments={attachments} setAttachments={setAttachments} />
                        </div>
                        <div className="w-full py-8 rounded-lg my-4 bg-slate-100">
                            <h2 className="font-semibold">Training Attendance</h2>
                            <AddAbsensi attachments={pdfAttachments} setAttachments={setPdfAttachments} />
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
                            to="/training"
                        >
                            Kembali
                        </Link>
                        <button
                            type="submit"
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                        >
                            <BiSave className="mr-2" />
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileTrainingEditor;