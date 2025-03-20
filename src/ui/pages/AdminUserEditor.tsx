import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import InputField from "../molecules/InputField";
import SelectInput from "../molecules/SelectInput";
import { DealerData } from "../../utils/masterData";
import { BiSave } from "react-icons/bi";

const AdminUserEditor: React.FC = () => {
    const { signUp } = useFirebase()
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [dealer, setDealer] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [authorization, setAuthorization] = useState<string>("");

    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await signUp(email, password, dealer, username, location, authorization);
            navigate("/admin/user"); // Navigasi ke halaman user setelah submit
        } catch (error) {
            console.error("Error saving data:", error);
        }

    };

    return (
        <div className="App overflow-x-hidden">
            <div className="pt-16">

                <form className="w-10/12 flex flex-col mx-auto my-8 justify-around items-center " onSubmit={handleSendData}>
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">User Information</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                            <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                            <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        </div>

                        <div className="md:flex w-full gap-5">
                            <SelectInput label="Authorization" name="authorization" value={authorization} onChange={(e) => setAuthorization(e.target.value)} options={["user","admin","dealer"]} />
                            <SelectInput label="Dealer" name="dealer" value={dealer} onChange={(e) => setDealer(e.target.value)} options={DealerData} />
                            <InputField label="Location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                        </div>
                    </div>

                    <div className="flex w-full justify-end items-center gap-x-5">
                        <button
                            type="submit"
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                        >
                            <BiSave className="mr-2" />
                            Save
                        </button>
                        <Link
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary rounded-full font-semibold"
                            to="/admin/Article"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminUserEditor;