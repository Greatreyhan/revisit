import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../utils/FirebaseContext";
import SelectInput from "../molecules/SelectInput";
import InputField from "../molecules/InputField";
import TextField from "../molecules/TextField";


const ProfileScheduleEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase, loading, user } = useFirebase()
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // General Information
    const [customer, setCustomer] = useState<string>("");
    const [dateStart, setDateStart] = useState<string>("")
    const [dateEnd, setDateEnd] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [description, setDescription] = useState<string>("");




    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        const newData = {
            customer,
            dateStart,
            dateEnd,
            status,
            address,
            type,
            description
        };

        try {
            await saveToDatabase(`schedule/${user?.uid}/${id || Date.now()}`, newData);
            navigate("/schedule"); // Navigasi ke halaman setelah submit
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    useEffect(() => {
        if (id) {
            getFromDatabase(`schedule/${user?.uid}/${id}`).then((data) => {
                if (data) {

                    // General Information
                    setCustomer(data.customer || "");
                    setDateStart(data.dateStart || "");
                    setDateEnd(data.dateEnd || "")
                    setStatus(data.status || "");
                    setAddress(data.address || "");
                    setType(data.type || "");
                    setDescription(data.description || "");
                }
            });
        }
    }, [id]);



    return (
        <div className="App overflow-x-hidden">
            <div className="pt-16">
                {loading && (
                    <div className="w-full h-full fixed bg-black bg-opacity-50 z-50 top-0 flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                )}

                <form className="md:w-10/12 w-11/12 flex flex-col mx-auto my-4 justify-around items-center" onSubmit={handleSendData}>

                    {/* General Information */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">General Information</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Customer Name" type="text" name="customerName" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Nama Customer" />
                            <InputField label="Address" type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Date Start" type="datetime-local" name="dateStart" value={dateStart} onChange={(e) => setDateStart(e.target.value)} placeholder="Date Start" />
                            <InputField label="Date End" type="datetime-local" name="dateEnd" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} placeholder="Date End" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput label="Type" name="type" value={type} onChange={(e) => setType(e.target.value)} options={['investigation', 'reguler']} />
                            <SelectInput label="Status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} options={['pending', 'done']} />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <TextField
                                label="Description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                required
                            />
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

                    {/* <div className="mt-8 w-full">
                        <Editor HTML={HTML} setDataEdit={setDataEdit} />
                    </div> */}
                    <div className="flex w-full justify-end items-center gap-x-5">
                        <Link
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary rounded-full font-semibold"
                            to="/report"
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
                        {/* <button
                            type="button"
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                        >
                            <BiSave className="mr-2" />
                            Export
                        </button> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileScheduleEditor;