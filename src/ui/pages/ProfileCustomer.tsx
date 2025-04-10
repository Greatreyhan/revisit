import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete, MdClose } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { IoMdSettings } from "react-icons/io";
import { CustomerData } from "../interface/Customer";

const ProfileCustomer = () => {
  const { getFromDatabase, deleteFromDatabase, user } = useFirebase();
  const [dataArticle, setDataArticle] = useState<{ [key: string]: CustomerData }>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string>("");
  const [deleteKey, setDeleteKey] = useState<string>("");

  useEffect(() => {
    getFromDatabase(`customer/${user?.uid}`).then((data) => {
      if (data) {
        console.log(data)
        const key = Object.keys(data);
        setKeyArticle(key);
        setDataArticle(data);
      }
    });
  }, []);

  return (
    <div className="w-10/12 mx-auto pt-8">
      
      {/* Modal Report Info */}
      <div onClick={() => setKeyData("")} className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${keyData === "" ? "hidden" : "flex"} justify-center items-center`}>
        <div className={`pb-6 bg-slate-50 rounded-lg flex flex-col`}>
          <div className="relative">
            <button onClick={() => setKeyData("")} className="absolute right-0 top-0" type="button">
              <MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" />
            </button>
            <table className="w-full">
              <thead>
                <tr>
                  <td className="font-semibold py-3 px-6 rounded-t-lg bg-slate-100" colSpan={2}>
                    Customer Information
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Nama</td>
                  <td className="w-10/12 p-2">: {dataArticle[keyData]?.customerName}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Area</td>
                  <td className="w-10/12 p-2">: {dataArticle[keyData]?.area}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Units</td>
                  <td className="w-10/12 p-2">
                    : {dataArticle[keyData]?.units?.reduce((sum, unit) => sum + (Number(unit.qtyUnit) || 0), 0)}
                  </td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Segment</td>
                  <td className="w-10/12 p-2">: {dataArticle[keyData]?.segment}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-sky-800 px-4 py-2 rounded-lg bg-sky-100 flex items-center"
                to={"/customer/editor/" + keyData}
              >
                <MdEdit className="text-md mr-1" />
                <p className="text-sm">Edit Data</p>
              </Link>

              {/* Tombol delete pada modal info: buka modal konfirmasi delete */}
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

      {/* Modal Konfirmasi Hapus */}
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
              <strong>{dataArticle[deleteKey]?.customerName}</strong>?
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
                  deleteFromDatabase("customer/" + user?.uid + "/" + deleteKey);
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
        <p>Total Customer: {keyArticle.length}</p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/customer/editor"}
        >
          <span className="text-2xl mr-2">+</span>Add Customer
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Nama</th>
              <th className="border p-4 whitespace-nowrap text-gray-900 md:table-cell hidden">Segment</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Type</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Unit</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {keyArticle.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4">{dataArticle[key]?.customerName}</td>
                <td className="border p-4 md:table-cell hidden">
                  {dataArticle[key]?.segment}
                </td>
                <td className="border p-4">{dataArticle[key]?.typeCustomer}</td>
                <td className="border p-4 text-center">
                  {dataArticle[key]?.units?.reduce(
                    (total, unit) => total + parseInt(unit.qtyUnit, 10),
                    0
                  ) || 0}
                </td>
                <td className="border-t p-4 md:flex gap-x-3 justify-around items-center hidden">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/customer/editor/" + key}
                  >
                    <MdEdit />
                  </Link>
                  {/* Tombol delete: buka modal konfirmasi delete */}
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

export default ProfileCustomer;
