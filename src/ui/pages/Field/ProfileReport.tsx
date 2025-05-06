import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdEdit,
  MdDelete,
  MdPrint,
  MdDangerous,
  MdGppGood,
  MdClose,
  MdContentCopy
} from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useFirebase } from "../../../utils/FirebaseContext";
import { ReportData } from "../../interface/Report";

const ProfileReport = () => {
  const {
    getFromDatabase,
    deleteFromDatabase,
    saveToDatabase,
    user
  } = useFirebase();
  const [data, setData] = useState<{ [key: string]: ReportData }>({});
  const [key, setKey] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string>("");
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string>("");

  useEffect(() => {
    getFromDatabase(`report/${user?.uid}`).then((data) => {
      if (data) {
        const keys = Object.keys(data);
        setKey(keys);
        setData(data);
      }
    });
  }, [getFromDatabase, user?.uid]);

  // Duplicate record
  const handleDuplicate = async (sourceKey: string) => {
    const source = data[sourceKey];
    if (!source) return;
    const newKey = Date.now().toString();
    // Deep clone to avoid mutating original
    const clone: ReportData = JSON.parse(JSON.stringify(source));
    await saveToDatabase(`report/${user?.uid}/${newKey}`, clone);
    // Update local state
    setData((prev) => ({ ...prev, [newKey]: clone }));
    setKey((prev) => [newKey, ...prev]);
  };

  const handleConfirmDelete = () => {
    deleteFromDatabase(`report/${user?.uid}/${confirmDeleteKey}`);
    setConfirmDeleteKey("");
    setKeyData("");
  };

  return (
    <div className="w-10/12 mx-auto pt-8">
      {/* Detail Modal */}
      <div
        onClick={() => setKeyData("")}
        className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${
          keyData === "" ? "hidden" : "flex"
        } justify-center items-center`}
      >
        <div className="pb-6 bg-slate-50 rounded-lg flex flex-col">
          <div className="relative">
            <button
              onClick={() => setKeyData("")}
              className="absolute right-0 top-0"
              type="button"
            >
              <MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" />
            </button>
            {/* ... table info ... */}
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-sky-800 px-4 py-2 rounded-lg bg-sky-100 flex items-center"
                to={`/report/editor/${keyData}`}
              >
                <MdEdit className="text-md mr-1" /> Edit Data
              </Link>

              <button
                className="text-rose-800 px-4 py-2 rounded-lg bg-rose-100 flex items-center"
                type="button"
                onClick={() => setConfirmDeleteKey(keyData)}
              >
                <MdDelete className="text-md mr-1" /> Delete Data
              </button>

              <button
                className="text-indigo-800 px-4 py-2 rounded-lg bg-indigo-100 flex items-center"
                type="button"
                onClick={() => handleDuplicate(keyData)}
              >
                <MdContentCopy className="text-md mr-1" /> Duplicate
              </button>

              <Link
                className="text-emerald-800 px-4 py-2 rounded-lg bg-emerald-100 flex items-center"
                to={`/report/view/${keyData}`}
              >
                <MdPrint className="text-md mr-1" /> Show Report
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <div
        onClick={() => setConfirmDeleteKey("")}
        className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${
          confirmDeleteKey === "" ? "hidden" : "flex"
        } justify-center items-center`}
      >
        <div
          className="bg-white p-6 rounded-lg shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4">Konfirmasi Hapus Data</h2>
          <p className="mb-6">
            Apakah Anda yakin ingin menghapus data ini?
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setConfirmDeleteKey("")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>

      {/* Header and Table */}
      <div className="flex items-center justify-between py-8">
      <p className="px-4 py-2 rounded-md bg-slate-100"><span className="text-sm pr-2">Total Report :</span> <span className="font-bold text-primary-dark">{key.length}</span></p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to="/report/editor"
        >
          <span className="text-2xl mr-2">+</span>Create Report
        </Link>
      </div>

      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4">#</th>
              <th className="border p-4">Title</th>
              <th className="border p-4 md:block hidden">Unit</th>
              <th className="border p-4">Customer</th>
              <th className="border p-4">Status</th>
              <th className="border p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {key.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4">
                  {/* ... title concat ... */}
                  {data[key]?.largeClassification + " " +
                    data[key]?.middleClassification + " " +
                    data[key]?.partProblem}
                </td>
                <td className="border p-4 md:table-cell hidden">
                  {/* ... unit concat ... */}
                  {data[key]?.focusModel + " " + data[key]?.euroType}
                </td>
                <td className="border p-4">{data[key]?.customerName}</td>
                <td className="border p-4">
                  {data[key]?.status === "Breakdown" ? (
                    <MdDangerous className="w-full text-xl text-rose-700" />
                  ) : (
                    <MdGppGood className="w-full text-xl text-emerald-700" />
                  )}
                </td>
                <td className="border-t p-4 md:flex gap-x-3 justify-around items-center hidden">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={`/report/editor/${key}`}
                  >
                    <MdEdit />
                  </Link>
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => setConfirmDeleteKey(key)}
                  >
                    <MdDelete />
                  </button>
                  <button
                    className="p-2 text-indigo-800 rounded-full bg-indigo-100"
                    type="button"
                    onClick={() => handleDuplicate(key)}
                  >
                    <MdContentCopy />
                  </button>
                  <Link
                    className="p-2 text-green-800 rounded-full bg-green-100"
                    to={`/report/view/${key}`}
                  >
                    <MdPrint />
                  </Link>
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

export default ProfileReport;
