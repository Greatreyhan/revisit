import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete, MdPrint } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { VisitData } from "../interface/Visit";

const AdminVisit = () => {
  const { getFromDatabase, deleteFromDatabase } = useFirebase();
  const [allReports, setAllReports] = useState<VisitData[]>([]);

  useEffect(() => {
      getFromDatabase("visit/").then((data) => {
        if (data) {
          console.log("Raw Data:", data);
  
          const reportsArray: VisitData[] = [];
  
          Object.entries(data).forEach(([userId, reports]) => {
            Object.entries(reports as Record<string, any>).forEach(([reportId, reportData]) => {
              reportsArray.push({ userId, reportId, ...(reportData as VisitData) });
            });
          });
          setAllReports(reportsArray);
        }
      });
    }, []);

  return (
    <div className="w-10/12 mx-auto pt-8">
      

      <div className="flex items-center justify-between py-8">
        <p>Total Visit: {allReports.length}</p>
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
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Customer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Dealer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 md:table-cell hidden">Segment</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Area</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Unit</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {allReports.map((data, i) => (
              <tr key={data?.reportId} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{data?.customerName}</td>
                <td className="border p-4 dark:border-dark-5">{data?.dealer}</td>
                <td className="border p-4 dark:border-dark-5 md:table-cell hidden">{data?.segment}</td>
                <td className="border p-4 dark:border-dark-5">{data?.area}</td>
                <td className="border p-4 dark:border-dark-5 text-center">  {data?.units.reduce((total, unit) => total + parseInt(unit.qtyUnit, 10), 0)}</td>
                <td className="border-t p-4 flex gap-x-3 justify-around items-center">
                  {/* <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/admin/visit/editor/"+ data?.userId + "/" + data?.reportId}
                  >
                    <MdEdit />
                  </Link> */}
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => deleteFromDatabase("visit/" + data?.userId + "/" + data?.reportId)}
                  >
                    <MdDelete />
                  </button>
                  <Link
                    className="p-2 text-green-800 rounded-full bg-green-100"
                    type="button"
                    to={"/admin/visit/"+ data?.userId + "/" + data?.reportId}
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

export default AdminVisit;
