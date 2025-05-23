import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete, MdClose } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useFirebase } from "../../../utils/FirebaseContext";
import { TraineeData } from "../../interface/Training";

const ProfileTraining = () => {
  const { getFromDatabase, deleteFromDatabase, user } = useFirebase();
  const [data, setData] = useState<{ [key: string]: TraineeData }>({});
  const [key, setKey] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string>("");
  const [deleteKey, setDeleteKey] = useState<string>("");

  useEffect(() => {
    getFromDatabase(`training/${user?.uid}`).then((data) => {
      if (data) {
        const keys = Object.keys(data);
        setKey(keys);
        setData(data);
      }
    });
  }, [getFromDatabase, user]);
  const formatDate = (isoString:string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', 
      month: 'long',   
      year: 'numeric', 
    }).format(date);
  };

  return (
    <div className="w-10/12 mx-auto pt-8">
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
                <tr>
                  <td className="font-semibold py-3 px-6 rounded-t-lg bg-slate-100" colSpan={2}>
                    Training Information
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Customer</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.customerName}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Title</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.title}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Unit</td>
                  <td className="w-10/12 p-2">
                    :{" "}
                    {data[keyData]?.unit
                      ? data[keyData]?.unit.join(", ")
                      : "-"}
                  </td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Dealer</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.dealer}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-sky-800 px-4 py-2 rounded-lg bg-sky-100 flex items-center"
                to={"/training/editor/" + keyData}
              >
                <MdEdit className="text-md mr-1" />
                <p className="text-sm">Edit Data</p>
              </Link>
              <button
                className="text-rose-800 px-4 py-2 rounded-lg bg-rose-100 flex items-center"
                type="button"
                onClick={() => {
                  setDeleteKey(keyData);
                  setKeyData("");
                }}
              >
                <MdDelete className="text-md mr-1" />
                <p className="text-sm">Delete Data</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {deleteKey !== "" && (
        <div
          onClick={() => setDeleteKey("")}
          className="fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-50 rounded-lg p-6 w-11/12 max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">Konfirmasi Hapus Data</h3>
            <p>
              Apakah anda yakin akan menghapus data{" "}
              <strong>{data[deleteKey]?.customerName}</strong>?
            </p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setDeleteKey("")}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => {
                  deleteFromDatabase("training/" + user?.uid + "/" + deleteKey);
                  setDeleteKey("");
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between py-8">
      <p className="px-4 py-2 rounded-md bg-slate-100"><span className="text-sm pr-2">Total Training :</span> <span className="font-bold text-primary-dark">{key.length}</span></p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/training/editor"}
        >
          <span className="text-2xl mr-2">+</span>Create Report
        </Link>
      </div>

      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Customer</th>
              <th className="border p-4 whitespace-nowrap text-gray-900 md:table-cell hidden">Title</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Start Date</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Unit</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {key.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4">{data[key]?.customerName}</td>
                <td className="border p-4 md:table-cell hidden">
                  {data[key]?.title}
                </td>
                <td className="border text-center">  {formatDate(data[key]?.startDate)}</td>
                <td className="border p-4 text-center">
                  {data[key]?.unit ? data[key]?.unit.length : 0}
                </td>
                <td className="border-t p-4 md:flex gap-x-3 justify-around items-center hidden">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/training/editor/" + key}
                  >
                    <MdEdit />
                  </Link>
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => setDeleteKey(key)}
                  >
                    <MdDelete />
                  </button>
                </td>
                <td className="border-t p-4 flex gap-x-3 justify-around items-center md:hidden">
                  <button
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    type="button"
                    onClick={() => setKeyData(key)}
                  >
                    <IoMdSettings />
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

export default ProfileTraining;
