import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import InputField from "../molecules/InputField";
import SelectInput from "../molecules/SelectInput";
import { BiSave } from "react-icons/bi";
import { IoIosEyeOff, IoMdEye } from "react-icons/io";

const ProfileSetting: React.FC = () => {
  const { getFromDatabase, user, setUpdatePassword, updateUserEmail, verifyEmail } = useFirebase();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [dealer, setDealer] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  // State untuk update email
  const [newEmail, setNewEmail] = useState<string>("");
  const [emailLastPassword, setEmailLastPassword] = useState<string>(""); // password untuk verifikasi update email

  // State untuk update password
  const [lastPassword, setLastPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  // State untuk toggle visibilitas password
  const [showEmailLastPassword, setShowEmailLastPassword] = useState<boolean>(false);
  const [showLastPassword, setShowLastPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  // State untuk mengontrol modal masing-masing
  const [modalEmailVisible, setModalEmailVisible] = useState<boolean>(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState<boolean>(false);

  // Ambil data user dari database
  useEffect(() => {
    getFromDatabase(`user/${user?.uid}`).then((data) => {
      if (data) {
        console.log(data)
        setEmail(data?.email || "");
        setUsername(data?.name || "");
        setDealer(data?.dealer || "");
        setLocation(data?.location || "");
      }
    });
  }, [getFromDatabase, user]);

  // Fungsi submit update email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newEmail.trim() && emailLastPassword.trim()) {
        // Fungsi updateUserEmail menerima lastPassword sebagai parameter pertama
        await updateUserEmail(emailLastPassword, newEmail);
        setModalEmailVisible(false);
        navigate("/admin/user");
      }
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  // Fungsi submit update password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newPassword.trim() && lastPassword.trim()) {
        await setUpdatePassword(lastPassword, newPassword);
        setModalPasswordVisible(false);
        navigate("/admin/user");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  // Fungsi untuk mengirim ulang email verifikasi
  const handleVerifyEmail = async () => {
    try {
      await verifyEmail();
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  return (
    <div className="App overflow-x-hidden">
      <div className="pt-16">
        {/* Tampilkan notifikasi jika email belum diverifikasi */}
        {user && !user.emailVerified && (
          <div className="w-10/12 mx-auto my-4 p-4 bg-yellow-100 border border-yellow-300 rounded-md">
            <p className="text-yellow-700">Email Anda belum diverifikasi.</p>
            <button
              onClick={handleVerifyEmail}
              className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
            >
              Kirim Ulang Verifikasi Email
            </button>
          </div>
        )}

        {/* Tampilan informasi user (read-only) */}
        <div className="w-10/12 flex flex-col mx-auto my-8 justify-around items-center">
          <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
            <h2 className="font-semibold">User Information</h2>
            <div className="md:flex w-full gap-5">
              <InputField
                disabled={true}
                label="Username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <InputField
                disabled={true}
                label="Current Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="md:flex w-full gap-5">
              <SelectInput
                disabled={true}
                label="Dealer"
                name="dealer"
                value={location}
                onChange={(e) => setDealer(e.target.value)}
                options={[dealer]}
              />
              <InputField
                disabled={true}
                label="Location"
                name="location"
                value={dealer}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
              />
            </div>
          </div>

          {/* Tombol Update Email dan Update Password */}
          <div className="flex w-full justify-end items-center gap-x-5">
            <button
              type="button"
              onClick={() => setModalEmailVisible(true)}
              className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
            >
              <BiSave className="mr-2" />
              Ubah Email
            </button>
            <button
              type="button"
              onClick={() => setModalPasswordVisible(true)}
              className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
            >
              <BiSave className="mr-2" />
              Ubah Password
            </button>
            <Link
              className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary rounded-full font-semibold"
              to="/admin/Article"
            >
              Kembali
            </Link>
          </div>
        </div>

        {/* Modal Update Email */}
        {modalEmailVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setModalEmailVisible(false)}></div>
            {/* Modal content */}
            <div className="relative bg-white p-6 rounded-md w-11/12 md:w-1/2 z-10">
              <h2 className="text-xl font-semibold mb-4">Update Email</h2>
              <form onSubmit={handleEmailSubmit}>
                <InputField
                  label="New Email"
                  name="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Masukkan email baru"
                />
                {/* Field Last Password untuk verifikasi */}
                <div className="relative mt-4">
                  <InputField
                    label="Last Password"
                    name="emailLastPassword"
                    type={showEmailLastPassword ? "text" : "password"}
                    value={emailLastPassword}
                    onChange={(e) => setEmailLastPassword(e.target.value)}
                    placeholder="Masukkan password lama"
                  >
                    <button
                      type="button"
                      onClick={() => setShowEmailLastPassword(!showEmailLastPassword)}
                      className="absolute right-3 top-10 text-gray-500 focus:outline-none"
                      aria-label={showEmailLastPassword ? "Hide password" : "Show password"}
                    >
                      {showEmailLastPassword ? <IoMdEye /> : <IoIosEyeOff />}
                    </button>
                  </InputField>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setModalEmailVisible(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2"
                  >
                    <BiSave />
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Update Password */}
        {modalPasswordVisible && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setModalPasswordVisible(false)}></div>
            {/* Modal content */}
            <div className="relative bg-white p-6 rounded-md w-11/12 md:w-1/2 z-10">
              <h2 className="text-xl font-semibold mb-4">Update Password</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="relative mt-4">
                  <InputField
                    label="Last Password"
                    name="lastPassword"
                    type={showLastPassword ? "text" : "password"}
                    value={lastPassword}
                    onChange={(e) => setLastPassword(e.target.value)}
                    placeholder="Masukkan password lama"
                  >
                    <button
                      type="button"
                      onClick={() => setShowLastPassword(!showLastPassword)}
                      className="absolute right-3 top-10 text-gray-500 focus:outline-none"
                      aria-label={showLastPassword ? "Hide password" : "Show password"}
                    >
                      {showLastPassword ? <IoMdEye /> : <IoIosEyeOff />}
                    </button>
                  </InputField>
                </div>
                <div className="relative mt-4">
                  <InputField
                    label="New Password"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password baru"
                  >
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-10 text-gray-500 focus:outline-none"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <IoMdEye /> : <IoIosEyeOff />}
                    </button>
                  </InputField>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setModalPasswordVisible(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2"
                  >
                    <BiSave />
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileSetting;
