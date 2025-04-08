import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdArchitecture, MdClose, MdPrint } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { VisitData } from "../interface/Visit";
import { IoMdSettings } from "react-icons/io";

const DealerVisit = () => {
  const { getFromDatabase, user } = useFirebase();
  const [allReports, setAllReports] = useState<VisitData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [keyData, setKeyData] = useState<number>(-1)
  
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

  const filteredReports = allReports.filter((report) => {
    const customer = report.customerName.toLowerCase();
    const dealer = report.dealer.toLowerCase();
    const segment = report.segment?.toLowerCase() || "";
    const area = report.area?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return customer.includes(query) || dealer.includes(query) || segment.includes(query) || area.includes(query);
  });

  return (
    <div className="md:w-10/12 w-11/12 mx-auto pt-8">

      <div onClick={() => setKeyData(-1)} className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${keyData == -1 ? "hidden" : "flex"} justify-center items-center`}>
        <div className={`pb-6 bg-slate-50 rounded-lg flex flex-col`}>
          <div className="relative">
            <button onClick={() => setKeyData(-1)} className="absolute right-0 top-0" type="button"><MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" /></button>
            <table className="w-full">
              <thead>
                <tr className="">
                  <td className="font-semibold py-3 px-6 rounded-t-lg bg-slate-100" colSpan={2}>Report Information</td>
                </tr>
              </thead>
              <tbody className="">
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Customer</td>
                  <td className=" w-10/12 p-2">: {allReports[keyData]?.customerName}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Dealer</td>
                  <td className=" w-10/12 p-2">: {allReports[keyData]?.dealer}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Area</td>
                  <td className=" w-10/12 p-2">: {allReports[keyData]?.area}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Units</td>
                  <td className=" w-10/12 p-2">: {allReports[keyData]?.units?.reduce((sum, unit) => sum + (Number(unit.qtyUnit) || 0), 0)}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Segment</td>
                  <td className=" w-10/12 p-2">: {allReports[keyData]?.segment}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-emerald-800 px-4 py-2 rounded-lg bg-emerald-100 flex items-center"
                type="button"
                to={"/dealer/visit/" + allReports[keyData]?.userId + "/" + allReports[keyData]?.reportId}
              >
                <MdPrint className="text-md mr-1" />
                <p className="text-sm">Show Visit</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-8">
        <p>Total Visit: {filteredReports.length}</p>
        {/* Input pencarian */}
        <div className="w-5/12 hidden md:flex">
          <input
            type="text"
            placeholder="Cari berdasarkan customer, dealer, segment, atau area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/dealer/visit/visualization"}
        >
          <span className="text-2xl mr-2"><MdArchitecture /></span>Visualize Visit
        </Link>
      </div>
      <div className="w-8/12 pb-2 md:hidden block">
        <input
          type="text"
          placeholder="Cari berdasarkan customer, dealer, segment, atau area..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Customer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 md:table-cell hidden">Dealer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 md:table-cell hidden">Segment</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Area</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Unit</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((data, i) => (
              <tr key={data?.reportId} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{data?.customerName}</td>
                <td className="border p-4 dark:border-dark-5 md:table-cell hidden">{data?.dealer}</td>
                <td className="border p-4 dark:border-dark-5 md:table-cell hidden">{data?.segment}</td>
                <td className="border p-4 dark:border-dark-5">{data?.area}</td>
                <td className="border p-4 dark:border-dark-5 text-center">
                  {data?.units.reduce((total, unit) => total + parseInt(unit.qtyUnit, 10), 0)}
                </td>
                <td className="border-t p-4 md:flex gap-x-3 justify-around items-center hidden">
                  <Link
                    className="p-2 text-green-800 rounded-full bg-green-100"
                    to={"/dealer/visit/" + data?.userId + "/" + data?.reportId}
                  >
                    <MdPrint />
                  </Link>
                </td>
                <td className="border-t p-4 flex gap-x-3 justify-around items-center md:hidden">

                  <button
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    type="button"
                    onClick={() => setKeyData(i)}
                  >
                    <IoMdSettings onClick={() => setKeyData(i)} />
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

export default DealerVisit;
