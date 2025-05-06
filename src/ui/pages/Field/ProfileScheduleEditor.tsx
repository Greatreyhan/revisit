import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../../utils/FirebaseContext";
import SelectInput from "../../molecules/SelectInput";
import InputField from "../../molecules/InputField";
import TextField from "../../molecules/TextField";
import { MapMarkerData } from "../../interface/MapSelector";
import MapSelector from "../../organisms/MapSelector";


const ProfileScheduleEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase, user, authData } = useFirebase()
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // State untuk menyimpan data input
    const [customer, setCustomer] = useState<string>("");
    const [dateStart, setDateStart] = useState<string>("");
    const [dateEnd, setDateEnd] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    // State untuk mengecek apakah data sudah diubah
    const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
    const [mapMarkers, setMapMarkers] = useState<MapMarkerData[]>()
    const [showMap, setShowMap] = useState<boolean>(false)

    // Customer Modal
    const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false)
    const [customers, setCustomers] = useState<any[]>([]);
    const [customerId, setCustomerId] = useState<string>("")

    // Fungsi untuk mendeteksi perubahan input
    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setter(e.target.value);
        setIsDataChanged(true); // Set bahwa ada perubahan data
    };

    const getScheduleID = (
        targetId: string
    ): string[] => {
        // cara 1: pakai find, karena id bersifat unik
        const found = customers.find(item => item.id === targetId);
        return found?.scheduleID ?? [];
    };

    // Fungsi untuk menyimpan data
    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        const newData = { customer, dateStart, dateEnd, status, address, type, description, mapMarkers, dealer: authData?.dealer ?? "", customerId };

        try {
            const dateNow = Date.now();
            await saveToDatabase(`schedule/${user?.uid}/${id || dateNow}`, newData);
            if (customerId) {
                const dataScheduleID = getScheduleID(customerId)
                if (id) {
                    // check if id exist
                    if (!dataScheduleID.includes(id)) {
                        dataScheduleID.push(id)
                        await saveToDatabase(`customer/${user?.uid}/${customerId}/scheduleID`, dataScheduleID);
                    }
                }
                else {
                    dataScheduleID.push(dateNow.toString())
                    await saveToDatabase(`customer/${user?.uid}/${customerId}/scheduleID`, dataScheduleID);
                }
            }
            setIsDataChanged(false); // Set bahwa data sudah tersimpan
            navigate("/schedule"); // Navigasi ke halaman lain setelah menyimpan
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    // Fetch data dari database jika ID tersedia
    useEffect(() => {
        if (id) {
            getFromDatabase(`schedule/${user?.uid}/${id}`).then((data) => {
                if (data) {
                    setCustomer(data.customer || "");
                    setDateStart(data.dateStart || "");
                    setDateEnd(data.dateEnd || "");
                    setStatus(data.status || "");
                    setAddress(data.address || "");
                    setType(data.type || "");
                    setDescription(data.description || "");
                    setMapMarkers(data.mapMarkers || [])
                    setCustomerId(data.customerId || "")
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

    // Fetch list of existing customers
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

    // Handler when choosing a customer from modal
    const handleSelectCustomer = (cust: any) => {
        setCustomer(cust.customerName || "");
        setAddress(cust.location || "");
        setMapMarkers(cust.locationMap ? [cust.locationMap] : []);
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
                        <div className="w-full gap-5 flex items-center justify-between">
                            <h2 className="font-semibold">General Information</h2>
                            <button
                                type="button"
                                className="px-4 py-2 bg-primary text-white rounded-full font-semibold"
                                onClick={() => setShowCustomerModal(true)}
                            >
                                Select Customer
                            </button>
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Customer Name" type="text" name="customerName" value={customer} onChange={handleChange(setCustomer)} placeholder="Nama Customer" />
                            <InputField label="Address" type="text" name="address" value={address} onChange={handleChange(setAddress)} placeholder="Address" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Date Start" type="datetime-local" name="dateStart" value={dateStart} onChange={handleChange(setDateStart)} placeholder="Date Start" />
                            <InputField label="Date End" type="datetime-local" name="dateEnd" value={dateEnd} onChange={handleChange(setDateEnd)} placeholder="Date End" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput label="Type" name="type" value={type} onChange={handleChange(setType)} options={['investigation', 'reguler']} />
                            <SelectInput label="Status" name="status" value={status} onChange={handleChange(setStatus)} options={['pending', 'done']} />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <TextField
                                label="Description"
                                name="description"
                                value={description}
                                onChange={handleChange(setDescription)}
                                placeholder="Description"
                                required
                            />
                        </div>
                    </div>

                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold mb-4">Map Location</h2>
                        <div className="relative w-full flex justify-center -mb-12 z-10">
                            <button className={`mt-4 px-6 py-2 justify-center items-center bg-primary rounded-full text-white font-semibold ${showMap ? "hidden" : "inline-flex"}`} onClick={() => setShowMap(true)} type="button">Tambah Titik</button>
                        </div>
                        <MapSelector setMarkers={setMapMarkers} markers={mapMarkers || []} setShow={setShowMap} show={showMap} />
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
                            to="/schedule"
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

export default ProfileScheduleEditor;