import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import { MdClose, MdDelete } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

interface UserData {
  email: string;
  type: string;
  dealer: string;
  location: string;
  name: string;
}

const AdminUser = () => {
  const { getFromDatabase, deleteFromDatabase } = useFirebase();
  const [database, setDatabase] = useState<{ [key: string]: UserData }>({});
  const [keyDatabase, setKeyDatabase] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All"); // Filter untuk tipe: All, Field, Dealer, Admin
  const [keyData, setKeyData] = useState<string>("")

  useEffect(() => {
    getFromDatabase(`user`).then((data) => {
      if (data) {
        const key = Object.keys(data);
        setKeyDatabase(key);
        setDatabase(data);
      }
    });
  }, []);

  // Filter data berdasarkan pencarian (misal: nama dan email) dan tipe
  const filteredKeys = keyDatabase.filter((key) => {
    const user = database[key];
    const queryMatch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch =
      typeFilter === "All"
        ? true
        : user.type.toLowerCase() === typeFilter.toLowerCase();
    return queryMatch && typeMatch;
  });

  return (
    <div className="md:w-10/12 w-11/12 mx-auto pt-8">

      <div onClick={() => setKeyData("")} className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${keyData == "" ? "hidden" : "flex"} justify-center items-center`}>
        <div className={`pb-6 bg-slate-50 rounded-lg flex flex-col w-10/12`}>
          <div className="relative">
            <button onClick={() => setKeyData("")} className="absolute right-0 top-0" type="button"><MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" /></button>
            <table className="w-full">
              <thead>
                <tr className="">
                  <td className="font-semibold py-3 px-6 rounded-t-lg bg-slate-100" colSpan={2}>User Information</td>
                </tr>
              </thead>
              <tbody className="">
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Email</td>
                  <td className=" w-10/12 p-2">: {database[keyData]?.email}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Username</td>
                  <td className=" w-10/12 p-2">: {database[keyData]?.name}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Type</td>
                  <td className=" w-10/12 p-2">: {database[keyData]?.type}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Dealer</td>
                  <td className=" w-10/12 p-2">: {database[keyData]?.dealer}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Location</td>
                  <td className=" w-10/12 p-2">: {database[keyData]?.location}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <button
                className="text-rose-800 px-4 py-2 rounded-lg bg-rose-100 flex items-center"
                type="button"
                onClick={() => deleteFromDatabase("user/" + keyData)}
              >
                <MdDelete className="text-md mr-1" />
                <p className="text-sm">Delete Data</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex sm:flex-row items-center justify-between pt-8 pb-4 gap-4">
        <div>
          <p>Total Users: {filteredKeys.length}</p>
        </div>

        {/* Input pencarian */}
        <div className="w-full sm:w-5/12 md:block hidden">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Dropdown filter untuk tipe */}
        <div className="hidden md:block">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="All">Semua</option>
            <option value="Field">Field</option>
            <option value="Dealer">Dealer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div>
          <Link
            className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
            to={"/admin/user/add"}
          >
            <span className="text-2xl mr-2">+</span>Add
          </Link>
        </div>
      </div>

      <div className="flex w-full pb-2 justify-between md:hidden">
        {/* Input pencarian */}
        <div className="w-8/12">
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="All">Semua</option>
            <option value="Field">Field</option>
            <option value="Dealer">Dealer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="border p-4 whitespace-nowrap font-normal text-gray-900">#</th>
              <th className="border p-4 whitespace-nowrap font-normal text-gray-900 md:table-cell hidden">Email</th>
              <th className="border p-4 whitespace-nowrap font-normal text-gray-900">Username</th>
              <th className="border p-4 whitespace-nowrap font-normal text-gray-900">Type</th>
              <th className="border p-4 whitespace-nowrap font-normal text-gray-900 md:table-cell hidden">Dealer</th>
              <th className="border p-4 whitespace-nowrap font-normal text-gray-900 md:table-cell hidden">Location</th>
              <th className="border p-4 whitespace-nowrap font-normal text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeys.map((key, i) => (
              <tr key={key} className="text-gray-700">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4 md:table-cell hidden">{database[key]?.email}</td>
                <td className="border p-4">{database[key]?.name}</td>
                <td className="border p-4">{database[key]?.type}</td>
                <td className="border p-4 md:table-cell hidden">{database[key]?.dealer}</td>
                <td className="border p-4 md:table-cell hidden">{database[key]?.location}</td>
                <td className="border-t p-4 md:flex gap-x-3 justify-around items-center hidden">
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => deleteFromDatabase("user/" + key)}
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

export default AdminUser;
