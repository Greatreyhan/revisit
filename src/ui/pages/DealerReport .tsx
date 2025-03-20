import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete, MdPrint, MdDangerous, MdGppGood } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { ReportData } from "../interface/Report";


const DealerReport = () => {
  const { getFromDatabase, deleteFromDatabase, user } = useFirebase();
  const [allReports, setAllReports] = useState<ReportData[]>([]);

  useEffect(() => {
      const fetchData = async () => {
        if (!user?.uid) return;
    
        try {
          // Ambil daftar cabang yang terkait dengan user
          const cabangData = await getFromDatabase(`cabang/${user.uid}`);
          const keys = cabangData ? Object.keys(cabangData) : [];
      
          // Ambil semua data schedule
          const reportData = await getFromDatabase("report/");
          if (!reportData) return;
      
          const reportArray: ReportData[] = [];
    
          Object.entries(reportData).forEach(([userId, schedules]) => {
            // Hanya proses jika userId ada di keys
            if (keys.includes(userId)) {
              Object.entries(schedules as Record<string, any>).forEach(([reportId, reportDetail]) => {
                reportArray.push({ userId, reportId, ...(reportDetail as ReportData) });
              });
            }
          });
    
          setAllReports(reportArray);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchData();
    }, [user?.uid]);

  return (
    <div className="w-10/12 mx-auto pt-8">

      <div className="flex items-center justify-between py-8">
        <p>Total Report: {allReports.length}</p>
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
                    to={"/dealer/report/"+ data?.userId + "/" + data?.reportId}
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

export default DealerReport;
