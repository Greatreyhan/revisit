import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete, MdPrint, MdDangerous, MdGppGood, MdArchitecture } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { ReportData } from "../interface/Report";

const AdminReport = () => {
  const { getFromDatabase, deleteFromDatabase } = useFirebase();
  const [allReports, setAllReports] = useState<ReportData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

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
    <div className="w-10/12 mx-auto pt-8">
      <div className="flex items-center justify-between py-8">
        <div>
          <p>Total Report: {filteredReports.length}</p>
        </div>

        {/* Input pencarian */}
        <div className="w-5/12">
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
            to={"/admin/report/visualization"}
          >
            <span className="text-2xl mr-2"><MdArchitecture /></span>Visualize Report
          </Link>
        </div>
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
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 md:block hidden">Unit</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Customer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Dealer</th>
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
                <td className="border p-4 dark:border-dark-5">{data.dealer}</td>
                <td className="border p-4 dark:border-dark-5">
                  {data.status === "Breakdown" ? (
                    <MdDangerous className="w-full text-xl text-rose-700" />
                  ) : (
                    <MdGppGood className="w-full text-xl text-emerald-700" />
                  )}
                </td>
                <td className="border-t p-4 gap-x-3 flex justify-around items-center">
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => deleteFromDatabase("report/" + data.userId + "/" + data.reportId)}
                  >
                    <MdDelete />
                  </button>
                  <Link
                    className="p-2 text-green-800 rounded-full bg-green-100"
                    to={"/admin/report/" + data.userId + "/" + data.reportId}
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
