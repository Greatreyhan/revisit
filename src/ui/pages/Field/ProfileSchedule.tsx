import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete, MdDangerous, MdGppGood, MdClose } from "react-icons/md";
import { useFirebase } from "../../../utils/FirebaseContext";
import { ScheduleData } from "../../interface/Schedule";
import { IoMdSettings } from "react-icons/io";

const ProfileSchedule = () => {
  const { getFromDatabase, deleteFromDatabase, user } = useFirebase();
  const [data, setData] = useState<{ [key: string]: ScheduleData }>({});
  const [key, setKey] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string>("");
  // state untuk modal konfirmasi hapus
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);

  useEffect(() => {
    getFromDatabase(`schedule/` + user?.uid).then((data) => {
      if (data) {
        console.log(data);
        const key = Object.keys(data);
        setKey(key);
        setData(data);
      }
    });
  }, []);

  const formatDate = (date: string) => {
    const formDate = new Date(date);
    const datePart = `${formDate.getDate()} ${formDate.toLocaleDateString("id-ID", { month: "long" })}`;
    return `${datePart}`;
  };

  const handleDelete = (key: string) => {
    deleteFromDatabase("schedule/" + user?.uid + "/" + key);
    setConfirmDeleteKey(null);
  };

  return (
    <div className="w-10/12 mx-auto pt-8">
      {/* Modal detail schedule */}
      <div
        onClick={() => setKeyData("")}
        className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${keyData === "" ? "hidden" : "flex"
          } justify-center items-center`}
      >
        <div className={`pb-6 bg-slate-50 rounded-lg flex flex-col`}>
          <div className="relative">
            <button onClick={() => setKeyData("")} className="absolute right-0 top-0" type="button">
              <MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" />
            </button>
            <table className="w-full">
              <thead>
                <tr className="">
                  <td className="font-semibold py-3 px-6 rounded-t-lg bg-slate-100" colSpan={2}>
                    Schedule Information
                  </td>
                </tr>
              </thead>
              <tbody className="">
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Customer</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.customer}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Date Start</td>
                  <td className="w-10/12 p-2">: {formatDate(data[keyData]?.dateStart)}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Date End</td>
                  <td className="w-10/12 p-2">: {formatDate(data[keyData]?.dateEnd)}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Address</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.address}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-sky-800 px-4 py-2 rounded-lg bg-sky-100 flex items-center"
                to={"/schedule/editor/" + keyData}
              >
                <MdEdit className="text-md mr-1" />
                <p className="text-sm">Edit Data</p>
              </Link>

              {/* Mengganti aksi hapus menjadi membuka modal konfirmasi */}
              <button
                className="text-rose-800 px-4 py-2 rounded-lg bg-rose-100 flex items-center"
                type="button"
                onClick={() => setConfirmDeleteKey(keyData)}
              >
                <MdDelete className="text-md mr-1" />
                <p className="text-sm">Delete Data</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal konfirmasi hapus data */}
      {confirmDeleteKey && (
        <div
          onClick={() => setConfirmDeleteKey(null)}
          className="fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4"
          >
            <h2 className="text-xl font-semibold">Konfirmasi Hapus Data</h2>
            <p>
              Apakah Anda yakin ingin menghapus data untuk customer:{" "}
              <strong>{data[confirmDeleteKey]?.customer}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteKey(null)}
                className="px-4 py-2 bg-gray-300 rounded-md"
                type="button"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteKey)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                type="button"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between py-8">
        <p className="px-4 py-2 rounded-md bg-slate-100"><span className="text-sm pr-2">Total Schedule :</span> <span className="font-bold text-primary-dark">{key.length}</span></p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/schedule/editor"}
        >
          <span className="text-2xl mr-2">+</span>Create Schedule
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Customer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Date</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 hidden md:table-cell">
                Address
              </th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Status</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {key.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{data[key]?.customer}</td>
                <td className="border-b md:p-4 p-1 dark:border-dark-5 flex flex-col h-full gap-1 items-center justify-center">
                  <span className="bg-blue-300 px-4 py-1 rounded-lg text-xs">
                    {formatDate(data[key]?.dateStart)}
                  </span>
                  <span className="bg-red-300 px-4 py-1 rounded-lg text-xs">
                    {formatDate(data[key]?.dateEnd)}
                  </span>
                </td>
                <td className="border p-4 dark:border-dark-5 hidden md:table-cell">
                  {data[key]?.address}
                </td>
                <td className="border p-4 dark:border-dark-5">
                  {data[key]?.status === "pending" ? (
                    <MdDangerous className="w-full text-xl text-rose-700" />
                  ) : (
                    <MdGppGood className="w-full text-xl text-emerald-700" />
                  )}
                </td>
                <td className="border-t p-4 gap-x-3 justify-around items-center hidden md:flex">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/schedule/editor/" + key}
                  >
                    <MdEdit />
                  </Link>
                  {/* Tombol hapus memicu modal konfirmasi */}
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => setConfirmDeleteKey(key)}
                  >
                    <MdDelete />
                  </button>
                </td>
                <td className="border-t p-4 flex gap-x-3 justify-around items-center md:hidden">
                  <button
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    type="button"
                    onClick={() => console.log("show")}
                  >
                    <IoMdSettings onClick={() => setKeyData(key)} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileSchedule;
