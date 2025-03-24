import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import InputField from "../molecules/InputField";
import SelectInput from "../molecules/SelectInput";
import { BiSave } from "react-icons/bi";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";

const DealerSetting: React.FC = () => {
    const { getFromDatabase, user, setUpdatePassword } = useFirebase()
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [lastPassword, setLastPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [dealer, setDealer] = useState<string>("");
    const [location, setLocation] = useState<string>("");

    // State untuk toggle visibilitas password
    const [showLastPassword, setShowLastPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await setUpdatePassword(lastPassword, newPassword);
            navigate("/admin/user"); // Navigasi ke halaman user setelah submit
        } catch (error) {
            console.error("Error saving data:", error);
        }

    };

    useEffect(() => {
        getFromDatabase(`user/${user?.uid}`).then((data) => {
            if (data) {
                setEmail(data?.email || "")
                setUsername(data?.name || "")
                setDealer(data?.dealer || "")
                setLocation(data?.location || "")
            }
        });
    }, []);

    return (
        <div className="App overflow-x-hidden">
            <div className="pt-16">

                <form className="w-10/12 flex flex-col mx-auto my-8 justify-around items-center " onSubmit={handleSendData}>
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">User Information</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField disabled={true} label="Username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                            <InputField disabled={true} label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                        </div>

                        <div className="md:flex w-full gap-5">
                            <SelectInput disabled={true} label="Dealer" name="dealer" value={dealer} onChange={(e) => setDealer(e.target.value)} options={[dealer]} />
                            <InputField disabled={true} label="Location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                        </div>

                        <div className="md:flex w-full gap-5">
                            <div className="relative flex-1">
                                <InputField
                                    label="Last Password"
                                    name="LastPassword"
                                    type={showLastPassword ? "text" : "password"}
                                    value={lastPassword}
                                    onChange={(e) => setLastPassword(e.target.value)}
                                    placeholder="*****"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setShowLastPassword(!showLastPassword)}
                                        className="text-gray-500 focus:outline-none"
                                        aria-label={showLastPassword ? "Hide password" : "Show password"}
                                    >
                                        {showLastPassword ? (
                                            <IoMdEye />
                                        ) : (
                                            <IoIosEyeOff />
                                        )}
                                    </button>
                                </InputField>
                            </div>
                            <div className="flex items-center justify-between flex-1">
                                <InputField
                                    label="New Password"
                                    name="NewPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="*****"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className=" text-gray-500 focus:outline-none"
                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? (
                                            <IoMdEye />
                                        ) : (
                                            <IoIosEyeOff />
                                        )}
                                    </button>
                                </InputField>
                            </div>                        </div>
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

export default DealerSetting;