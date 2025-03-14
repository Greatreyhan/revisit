import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete, MdPrint } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { ReportData } from "../interface/Report";

const ProfileReport = () => {
  const {getFromDatabase, deleteFromDatabase } = useFirebase();
  const [dataArticle, setDataArticle] = useState<{ [key: string]: ReportData }>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);

  useEffect(() => {
    getFromDatabase(`report`).then((data) => {
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
      <div className="flex items-center justify-between py-8">
        <p>Total Report: {keyArticle.length}</p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/visit/editor"}
        >
          <span className="text-2xl mr-2">+</span>Create Report
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">#</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Title</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Unit</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Customer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Status</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap font-normal text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {keyArticle.map((key, i) => (
              <tr key={key} className="text-gray-700">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.largeClassification +" "+dataArticle[key]?.middleClassification + " " + dataArticle[key]?.partProblem}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.focusModel + " " + dataArticle[key]?.euroType}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.customerName}</td>
                <td className="border p-4 dark:border-dark-5">{dataArticle[key]?.status}</td>
                <td className="border-t p-4 flex gap-x-3 justify-around items-center">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/report/editor/" + key}
                  >
                    <MdEdit />
                  </Link>
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => deleteFromDatabase("report/"+key)}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileReport;
