import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdPrint } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { VisitData } from "../interface/Visit";

const DealerVisit = () => {
  const { getFromDatabase, user } = useFirebase();
  const [allReports, setAllReports] = useState<VisitData[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        if (!user?.uid) return;
    
        try {
          // Ambil daftar cabang yang terkait dengan user
          const cabangData = await getFromDatabase(`cabang/${user.uid}`);
          const keys = cabangData ? Object.keys(cabangData) : [];
      
          // Ambil semua data schedule
          const visitData = await getFromDatabase("visit/");
          if (!visitData) return;
      
          const visitArray: VisitData[] = [];
    
          Object.entries(visitData).forEach(([userId, visits]) => {
            if (keys.includes(userId)) {
              Object.entries(visits as Record<string, any>).forEach(([reportId, visitDetail]) => {
                visitArray.push({ userId, reportId, ...(visitDetail as VisitData) });
              });
            }
          });
    
          setAllReports(visitArray);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchData();
    }, [user?.uid]);

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
                  <Link
                    className="p-2 text-green-800 rounded-full bg-green-100"
                    type="button"
                    to={"/dealer/visit/"+ data?.userId + "/" + data?.reportId}
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

export default DealerVisit;
