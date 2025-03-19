import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete, MdPrint, MdDangerous, MdGppGood, MdClose } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { ReportData } from "../interface/Report";
import { IoMdSettings } from "react-icons/io";

const ProfileReport = () => {
  const { getFromDatabase, deleteFromDatabase, user } = useFirebase();
  const [dataArticle, setDataArticle] = useState<{ [key: string]: ReportData }>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string>("")

  useEffect(() => {
    getFromDatabase(`report/${user?.uid}`).then((data) => {
      if (data) {
        const key = Object.keys(data);
        setKeyArticle(key);
        setDataArticle(data);
      }
    });
  }, []);

  return (
    <div className="w-10/12 mx-auto pt-8">
      <div onClick={() => setKeyData("")} className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${keyData == "" ? "hidden" : "flex"} justify-center items-center`}>
        <div className={`pb-6 bg-slate-50 rounded-lg flex flex-col`}>
          <div className="relative">
            <button onClick={() => setKeyData("")} className="absolute right-0 top-0" type="button"><MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" /></button>
            <table className="w-full">
              <thead>
                <tr className="">
                  <td className="font-semibold py-3 px-6 rounded-t-lg bg-slate-100" colSpan={2}>Report Information</td>
                </tr>
              </thead>
              <tbody className="">
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Title</td>
                  <td className=" w-10/12 p-2">: {dataArticle[keyData]?.largeClassification + " " + dataArticle[keyData]?.middleClassification + " " + dataArticle[keyData]?.partProblem}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Unit</td>
                  <td className=" w-10/12 p-2">: {dataArticle[keyData]?.focusModel + " " + dataArticle[keyData]?.euroType}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Customer</td>
                  <td className=" w-10/12 p-2">: {dataArticle[keyData]?.customerName}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Status</td>
                  <td className=" w-10/12 p-2">: {dataArticle[keyData]?.status}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-sky-800 px-4 py-2 rounded-lg bg-sky-100 flex items-center"
                to={"/report/editor/" + keyData}
              >
                <MdEdit className="text-md mr-1" />
                <p className="text-sm">Edit Data</p>
              </Link>

              <button
                className="text-rose-800 px-4 py-2 rounded-lg bg-rose-100 flex items-center"
                type="button"
                onClick={() => deleteFromDatabase("report/" + user?.uid + "/" + keyData)}
              >
                <MdDelete className="text-md mr-1" />
                <p className="text-sm">Delete Data</p>
              </button>
              <Link
                className="text-emerald-800 px-4 py-2 rounded-lg bg-emerald-100 flex items-center"
                type="button"
                to={"/report/view/" + keyData}
              >
                <MdPrint className="text-md mr-1" />
                <p className="text-sm">Show Report</p>
              </Link>
            </div>
          </div>


        </div>
      </div>
      <div className="flex items-center justify-between py-8">
        <p>Total Report: {keyArticle.length}</p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/report/editor"}
        >
          <span className="text-2xl mr-2">+</span>Create Report
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Title</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 md:block hidden">Unit</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Customer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Status</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {keyArticle.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.largeClassification + " " + dataArticle[key]?.middleClassification + " " + dataArticle[key]?.partProblem}</td>
                <td className="border p-4 dark:border-dark-5 md:table-cell hidden">{dataArticle[key]?.focusModel + " " + dataArticle[key]?.euroType}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.customerName}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.status == 'Breakdown' ? <MdDangerous className="w-full text-xl text-rose-700" /> : <MdGppGood className="w-full text-xl text-emerald-700" />}</td>
                <td className="border-t p-4 md:flex gap-x-3 justify-around items-center hidden">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/report/editor/" + key}
                  >
                    <MdEdit />
                  </Link>
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => deleteFromDatabase("report/" + user?.uid + "/" + key)}
                  >
                    <MdDelete />
                  </button>
                  <Link
                    className="p-2 text-green-800 rounded-full bg-green-100"
                    type="button"
                    to={"/report/view/" + key}
                  >
                    <MdPrint />
                  </Link>
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

export default ProfileReport;
