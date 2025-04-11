import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../utils/FirebaseContext";
import SelectInput from "../molecules/SelectInput";
import InputField from "../molecules/InputField";
import { cargoTypesData, dataModelIsuzu, DealerData, segmentData } from "../../utils/masterData";
import AddAttachment from "../organisms/AddAttachment";
import { AttachmentItem } from "../interface/Report";


const DealerHealthEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase } = useFirebase()
    const navigate = useNavigate();
    const { uid,id } = useParams<{ uid:string, id: string }>();

    // State untuk mengecek apakah data sudah diubah
    const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
    //------------------------
    // Data Customer
    const [customerName, setCustomerName] = useState<string>("");
    const [dealer, setDealer] = useState<string>("");
    const [segment, setSegment] = useState<string>("");
    const [typeUnit, setTypeUnit] = useState<string>("");
    const [rearBodyType, setRearBodyType] = useState<string>("");
    const [goodType, setGoodType] = useState<string>("");
    const [payload, setPayload] = useState<string>("");
    const [attachments, setAttachments] = useState<AttachmentItem[]>([]);


    // Data Health
    const [fuelConsumption, setFuelConsumption] = useState<string>("");
    const [downloadDate, setDownloadDate] = useState<string>("");
    const [explainDate, setExplainDate] = useState<string>("");


    // Fungsi untuk mendeteksi perubahan input
    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setter(e.target.value);
        setIsDataChanged(true); // Set bahwa ada perubahan data
    };

    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        const newData = {
            // Data Customer
            dealer,
            customerName,
            segment,
            typeUnit,
            rearBodyType,
            goodType,
            payload,
            // mapMarkers,

            // Data Health
            fuelConsumption,
            downloadDate,
            explainDate,
            attachments
        };

        try {
            await saveToDatabase(`health/${uid}/${id || Date.now()}`, newData);
            setIsDataChanged(false); // Menandakan bahwa data sudah tersimpan
            navigate("/health"); // Navigasi ke halaman lain setelah penyimpanan data
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    // Fetch data dari database jika ID tersedia
    useEffect(() => {
        if (id) {
            getFromDatabase(`health/${uid}/${id}`).then((data) => {
                if (data) {
                    // Data Customer
                    setDealer(data.dealer || "")
                    setCustomerName(data.customerName || "");
                    setSegment(data.segment || "");
                    setTypeUnit(data.typeUnit || "");
                    setRearBodyType(data.rearBodyType || "");
                    setGoodType(data.goodType || "");
                    setPayload(data.payload || "");
                    // setMapMarkers(data.mapMarkers || []);

                    // Data Health
                    setFuelConsumption(data.fuelConsumption || "");
                    setDownloadDate(data.downloadDate || "");
                    setExplainDate(data.explainDate || "");

                    // Attachment
                    setAttachments(data.attachments || []);
                }
            });
        }
    }, [id]);

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
                            <SelectInput
                                required={true}
                                disabled={true} 
                                label="Dealer"
                                name="dealer"
                                value={dealer}
                                onChange={handleChange(setDealer)}
                                options={DealerData}
                            />
                            <InputField disabled={true} label="Customer Name" type="text" name="customerName" value={customerName} onChange={handleChange(setCustomerName)} placeholder="Nama Customer" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField disabled={true} label="Download Date" type="datetime-local" name="dateStart" value={downloadDate} onChange={handleChange(setDownloadDate)} placeholder="Download Date" />
                            <InputField disabled={true} label="Explain Date" type="datetime-local" name="dateEnd" value={explainDate} onChange={handleChange(setExplainDate)} placeholder="Explain Date" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput disabled={true} label="Tipe Unit" name="typeUnit" value={typeUnit} onChange={(e) => setTypeUnit(e.target.value)} options={dataModelIsuzu} />
                            <SelectInput disabled={true} label="Rear Body Type" name="rearBodyType" value={rearBodyType} onChange={(e) => setRearBodyType(e.target.value)} options={cargoTypesData} />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField type="number" disabled={true} label="Payload (KG)" name="payload" value={payload} onChange={(e) => setPayload(e.target.value)} placeholder="Payload" />
                            <InputField disabled={true} label="Tipe Barang" name="goodType" value={goodType} onChange={(e) => setGoodType(e.target.value)} placeholder="Masukkan tipe barang" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput
                                disabled={true} 
                                label="Segment"
                                name="segment"
                                value={segment}
                                onChange={handleChange(setSegment)}
                                options={segmentData}
                            />
                            <InputField type="number" disabled={true} label="Konsumsi Bahan Bakar (km/l)" name="fuelConsumption" value={fuelConsumption} onChange={(e) => setFuelConsumption(e.target.value)} placeholder="Fuel Consumption" />
                        </div>
                        {/* Attachment */}
                        <div className="w-full py-8 rounded-lg my-4 bg-slate-100">
                            <h2 className="font-semibold">Foto Saat Penjelasan Ke Customer</h2>
                            <AddAttachment disabled={true} attachments={attachments} setAttachments={setAttachments} />
                        </div>

                        {/* <div className="w-full py-8 rounded-lg my-4 bg-slate-100">
                            <h2 className="font-semibold">File Health Report</h2>
                            <AddAttachment attachments={attachments} setAttachments={setAttachments} />
                        </div> */}
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
                            to="/health"
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

export default DealerHealthEditor;