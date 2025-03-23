import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete, MdPrint, MdDangerous, MdGppGood, MdArchitecture } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { ReportData } from "../interface/Report";


const AdminReport = () => {
  const { getFromDatabase, deleteFromDatabase } = useFirebase();
  const [allReports, setAllReports] = useState<ReportData[]>([]);

  useEffect(() => {
    getFromDatabase("report/").then((data) => {
      if (data) {
        console.log("Raw Data:", data);

        const reportsArray: ReportData[] = [];

        Object.entries(data).forEach(([userId, reports]) => {
          Object.entries(reports as Record<string, any>).forEach(([reportId, reportData]) => {
            reportsArray.push({ userId, reportId, ...(reportData as ReportData) });
          });
        });
        setAllReports(reportsArray);
      }
    });
  }, []);

  return (
    <div className="w-10/12 mx-auto pt-8">

      <div className="flex items-center justify-between py-8">
        <p>Total Report: {allReports.length}</p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/admin/report/visualization"}
        >
          <span className="text-2xl mr-2"><MdArchitecture /></span>Visualize Report
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
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Dealer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Status</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {allReports.map((data, i) => (
              <tr key={data.reportId} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{data?.largeClassification + " " + data?.middleClassification + " " + data?.partProblem}</td>
                <td className="border p-4 dark:border-dark-5 md:table-cell hidden">{data?.focusModel + " " + data?.euroType}</td>
                <td className="border p-4 dark:border-dark-5">{data?.customerName}</td>
                <td className="border p-4 dark:border-dark-5">{data?.dealer}</td>
                <td className="border p-4 dark:border-dark-5">{data?.status == 'Breakdown' ? <MdDangerous className="w-full text-xl text-rose-700" /> : <MdGppGood className="w-full text-xl text-emerald-700" />}</td>
                <td className="border-t p-4 gap-x-3 flex justify-around items-center">
                  {/* <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/admin/report/editor/"+ data?.userId + "/" + data?.reportId}
                  >
                    <MdEdit />
                  </Link> */}
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => deleteFromDatabase("report/" + data?.userId + "/" + data?.reportId)}
                  >
                    <MdDelete />
                  </button>
                  <Link
                    className="p-2 text-green-800 rounded-full bg-green-100"
                    type="button"
                    to={"/admin/report/"+ data?.userId + "/" + data?.reportId}
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

export default AdminReport;
