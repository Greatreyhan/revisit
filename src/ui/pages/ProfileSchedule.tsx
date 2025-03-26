import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete, MdDangerous, MdGppGood, MdClose } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { ScheduleData } from "../interface/Schedule";
import { IoMdSettings } from "react-icons/io";

const ProfileSchedule = () => {
  const { getFromDatabase, deleteFromDatabase, user } = useFirebase();
  const [dataArticle, setDataArticle] = useState<{ [key: string]: ScheduleData }>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string>("")

  useEffect(() => {
    getFromDatabase(`schedule/` + user?.uid).then((data) => {
      if (data) {
        console.log(data)
        const key = Object.keys(data);
        setKeyArticle(key);
        setDataArticle(data);
      }
    });
  }, []);

  const formatDate = (date: string) => {
    const formDate = new Date(date);
    const datePart = `${formDate.getDate()} ${formDate.toLocaleDateString('id-ID', { month: 'long'})}`;

    return `${datePart}`;
  };

  return (
    <div className="w-10/12 mx-auto pt-8">
      <div onClick={() => setKeyData("")} className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${keyData == "" ? "hidden" : "flex"} justify-center items-center`}>
        <div className={`pb-6 bg-slate-50 rounded-lg flex flex-col`}>
          <div className="relative">
            <button onClick={() => setKeyData("")} className="absolute right-0 top-0" type="button"><MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" /></button>
            <table className="w-full">
              <thead>
                <tr className="">
                  <td className="font-semibold py-3 px-6 rounded-t-lg bg-slate-100" colSpan={2}>Schedule Information</td>
                </tr>
              </thead>
              <tbody className="">
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Customer</td>
                  <td className=" w-10/12 p-2">: {dataArticle[keyData]?.customer}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Date Start</td>
                  <td className=" w-10/12 p-2">: {formatDate(dataArticle[keyData]?.dateStart)}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Date End</td>
                  <td className=" w-10/12 p-2">: {formatDate(dataArticle[keyData]?.dateEnd)}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Address</td>
                  <td className=" w-10/12 p-2">: {dataArticle[keyData]?.address}</td>
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

              <button
                className="text-rose-800 px-4 py-2 rounded-lg bg-rose-100 flex items-center"
                type="button"
                onClick={() => deleteFromDatabase("schedule/" + user?.uid + "/" + keyData)}
              >
                <MdDelete className="text-md mr-1" />
                <p className="text-sm">Delete Data</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between py-8">
        <p>Total Schedule: {keyArticle.length}</p>
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
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 hidden md:table-cell">Address</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Status</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {keyArticle.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.customer}</td>
                <td className="border-b p-4 dark:border-dark-5 flex flex-col h-full gap-1 items-center justify-center"><span className="bg-sky-100 px-4 py-1 rounded-lg">{formatDate(dataArticle[key]?.dateStart)}</span><span className="bg-rose-100 px-4 py-1 rounded-lg">{formatDate(dataArticle[key]?.dateEnd)}</span></td>
                <td className="border p-4 dark:border-dark-5 hidden md:table-cell">{dataArticle[key]?.address}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.status == 'pending' ? <MdDangerous className="w-full text-xl text-rose-700" /> : <MdGppGood className="w-full text-xl text-emerald-700" />}</td>
                <td className="border-t p-4 gap-x-3 justify-around items-center hidden md:flex">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/schedule/editor/" + key}
                  >
                    <MdEdit />
                  </Link>
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => deleteFromDatabase("schedule/" + user?.uid + "/" + key)}
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
