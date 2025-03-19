import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../utils/FirebaseContext";
import SelectInput from "../molecules/SelectInput";
import InputField from "../molecules/InputField";
import TextField from "../molecules/TextField";


const ProfileScheduleEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase, user } = useFirebase()
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
  
      // Fungsi untuk mendeteksi perubahan input
      const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
          setter(e.target.value);
          setIsDataChanged(true); // Set bahwa ada perubahan data
      };
  
      // Fungsi untuk menyimpan data
      const handleSendData = async (e: React.FormEvent) => {
          e.preventDefault();
          
          const newData = { customer, dateStart, dateEnd, status, address, type, description };
  
          try {
              await saveToDatabase(`schedule/${user?.uid}/${id || Date.now()}`, newData);
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
    
        const handleBackButton = (event: PopStateEvent) => {
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
                        <h2 className="font-semibold">General Information</h2>
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