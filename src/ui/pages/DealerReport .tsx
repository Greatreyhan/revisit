import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdPrint, MdDangerous, MdGppGood, MdArchitecture, MdClose } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { ReportData } from "../interface/Report";
import { IoMdSettings } from "react-icons/io";


const DealerReport = () => {
  const { getFromDatabase, user } = useFirebase();
  const [allReports, setAllReports] = useState<ReportData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [keyData, setKeyData] = useState<number>(-1)

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

  // Filter data berdasarkan pencarian (judul, unit, customer, dealer) dan status
  const filteredReports = allReports.filter((report) => {
    const title = `${report.largeClassification} ${report.middleClassification} ${report.partProblem}`.toLowerCase();
    const unit = `${report.focusModel} ${report.euroType}`.toLowerCase();
    const customer = report.customerName.toLowerCase();
    const dealer = report.dealer.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      title.includes(query) ||
      unit.includes(query) ||
      customer.includes(query) ||
      dealer.includes(query);

    const matchesStatus =
      statusFilter === "All"
        ? true
        : report.status === statusFilter ||
        (statusFilter === "Operational" && report.status !== "Breakdown");

    return matchesSearch && matchesStatus;
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
                  <td className="px-6 w-3/12 p-2">Title</td>
                  <td className=" w-10/12 p-2">: {allReports[keyData]?.largeClassification + " " + allReports[keyData]?.middleClassification + " " + allReports[keyData]?.partProblem}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Unit</td>
                  <td className=" w-10/12 p-2">: {allReports[keyData]?.focusModel + " " + allReports[keyData]?.euroType}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Customer</td>
                  <td className=" w-10/12 p-2">: {allReports[keyData]?.customerName}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Dealer</td>
                  <td className=" w-10/12 p-2">: {allReports[keyData]?.dealer}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-3/12 p-2">Status</td>
                  <td className=" w-10/12 p-2">: {allReports[keyData]?.status}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-emerald-800 px-4 py-2 rounded-lg bg-emerald-100 flex items-center"
                type="button"
                to={"/dealer/report/" + allReports[keyData]?.userId + "/" + allReports[keyData]?.reportId}
              >
                <MdPrint className="text-md mr-1" />
                <p className="text-sm">Show Report</p>
              </Link>
            </div>
          </div>


        </div>
      </div>
      <div className="flex items-center justify-between py-8">
        <div>
          <p>Total Report: {filteredReports.length}</p>
        </div>

        {/* Input pencarian */}
        <div className="md:block hidden w-5/12">
          <input
            type="text"
            placeholder="Cari berdasarkan judul, unit, customer, atau dealer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <Link
            className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
            to={"/dealer/report/visualization"}
          >
            <span className="text-2xl mr-2"><MdArchitecture /></span>Visualize Report
          </Link>
        </div>
      </div>

      {/* Input pencarian */}
      <div className="md:hidden block pb-2 w-11/12">
        <input
          type="text"
          placeholder="Cari berdasarkan judul, unit, customer, atau dealer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Filter tombol status */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setStatusFilter("All")}
          className={`px-4 py-2 rounded ${statusFilter === "All" ? "bg-red-700 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("Breakdown")}
          className={`px-4 py-2 rounded ${statusFilter === "Breakdown" ? "bg-red-700 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Breakdown
        </button>
        <button
          onClick={() => setStatusFilter("Operational")}
          className={`px-4 py-2 rounded ${statusFilter === "Operational" ? "bg-red-700 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Operational
        </button>
      </div>

      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Title</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 md:table-cell hidden">Unit</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Customer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 md:table-cell hidden">Dealer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Status</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((data, i) => (
              <tr key={data.reportId} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4">
                  {data.largeClassification + " " + data.middleClassification + " " + data.partProblem}
                </td>
                <td className="border p-4 dark:border-dark-5 md:table-cell hidden">
                  {data.focusModel + " " + data.euroType}
                </td>
                <td className="border p-4 dark:border-dark-5">{data.customerName}</td>
                <td className="border p-4 dark:border-dark-5 md:table-cell hidden">{data.dealer}</td>
                <td className="border p-4 dark:border-dark-5">
                  {data.status === "Breakdown" ? (
                    <MdDangerous className="w-full text-xl text-rose-700" />
                  ) : (
                    <MdGppGood className="w-full text-xl text-emerald-700" />
                  )}
                </td>
                <td className="border-t p-4 gap-x-3 md:flex justify-around items-center hidden">
                  <Link
                    className="p-2 text-green-800 rounded-full bg-green-100"
                    to={"/dealer/report/" + data.userId + "/" + data.reportId}
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

export default DealerReport;
