import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import SelectInput from "../molecules/SelectInput";
import InputField from "../molecules/InputField";
import { cargoTypesData, dataModelIsuzu, DealerData, segmentData } from "../../utils/masterData";
import AddAttachment from "../organisms/AddAttachment";
import { AttachmentItem } from "../interface/Report";
import AddHealthReport from "../organisms/AddHealthReport";
import { PdfAttachmentItem } from "../interface/PDF";


const AdminHealthEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase } = useFirebase()
    const navigate = useNavigate();
    const { uid, id } = useParams<{ uid: string, id: string }>();

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

    // Image Attachments
    const [imageAttachments, setImageAttachments] = useState<AttachmentItem[]>([]);

    // PDF Health Reports
    const [pdfAttachments, setPdfAttachments] = useState<PdfAttachmentItem[]>([]);



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
                    setImageAttachments(data.images || []);
                    setPdfAttachments(data.healthReports || []);
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
                <form
                    className="md:w-10/12 w-11/12 flex flex-col mx-auto my-4 justify-around items-center"
                    onSubmit={handleSendData}
                >
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Report Information</h2>
                        <div className="md:flex w-full gap-5">
                            <SelectInput
                                required
                                label="Dealer"
                                name="dealer"
                                value={dealer}
                                onChange={handleChange(setDealer)}
                                options={DealerData}
                            />
                            <InputField
                                label="Customer Name"
                                type="text"
                                name="customerName"
                                value={customerName}
                                onChange={handleChange(setCustomerName)}
                                placeholder="Nama Customer"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                label="Download Date"
                                type="datetime-local"
                                name="downloadDate"
                                value={downloadDate}
                                onChange={handleChange(setDownloadDate)}
                                placeholder="Download Date"
                            />
                            <InputField
                                label="Explain Date"
                                type="datetime-local"
                                name="explainDate"
                                value={explainDate}
                                onChange={handleChange(setExplainDate)}
                                placeholder="Explain Date"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput
                                label="Tipe Unit"
                                name="typeUnit"
                                value={typeUnit}
                                onChange={e => setTypeUnit(e.target.value)}
                                options={dataModelIsuzu}
                            />
                            <SelectInput
                                label="Rear Body Type"
                                name="rearBodyType"
                                value={rearBodyType}
                                onChange={e => setRearBodyType(e.target.value)}
                                options={cargoTypesData}
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                type="number"
                                label="Payload (KG)"
                                name="payload"
                                value={payload}
                                onChange={e => setPayload(e.target.value)}
                                placeholder="Payload"
                            />
                            <InputField
                                label="Tipe Barang"
                                name="goodType"
                                value={goodType}
                                onChange={e => setGoodType(e.target.value)}
                                placeholder="Masukkan tipe barang"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput
                                label="Segment"
                                name="segment"
                                value={segment}
                                onChange={handleChange(setSegment)}
                                options={segmentData}
                            />
                            <InputField
                                type="number"
                                label="Konsumsi Bahan Bakar (km/l)"
                                name="fuelConsumption"
                                value={fuelConsumption}
                                onChange={handleChange(setFuelConsumption)}
                                placeholder="Fuel Consumption"
                            />
                        </div>

                        {/* Foto Dokumentasi */}
                        <div className="w-full py-8 rounded-lg my-4 bg-slate-100">
                            <h2 className="font-semibold">Foto Saat Penjelasan Ke Customer</h2>
                            <AddAttachment
                                disabled={true}
                                attachments={imageAttachments}
                                setAttachments={setImageAttachments}
                            />
                        </div>

                        {/* File Health Report PDF */}
                        <div className="w-full py-8 rounded-lg my-4 bg-slate-100">
                            <h2 className="font-semibold">File Health Report</h2>
                            <AddHealthReport
                                disabled={true}
                                attachments={pdfAttachments}
                                setAttachments={setPdfAttachments}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex w-full justify-end items-center gap-x-5">
                        <Link
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary rounded-full font-semibold"
                            to="/admin/health"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminHealthEditor;