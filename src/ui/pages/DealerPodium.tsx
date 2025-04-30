import React, { useState, useEffect, useMemo } from "react";
import { MdArrowOutward, MdClose, MdDownload, MdPrint } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

// Tipe untuk summary data tiap user
interface SummaryData {
  uid: string;
  name: string;
  report: string[];    // array ID report
  visit: string[];     // array ID visit
  health: string[];    // array ID health
  training: string[];  // array ID training
  score: number;       // skor berdasarkan panjang array
}

// Tipe untuk konfigurasi sorting
interface SortConfig {
  column: keyof SummaryData;
  order: "asc" | "desc";
}

const DealerPodium: React.FC = () => {
  const { getFromDatabase, user } = useFirebase();

  // State untuk daftar ID kategori per user
  const [reportData, setReportData] = useState<Record<string, Record<string, any>>>({});
  const [visitData, setVisitData] = useState<Record<string, Record<string, any>>>({});
  const [healthData, setHealthData] = useState<Record<string, Record<string, any>>>({});
  const [trainingData, setTrainingData] = useState<Record<string, Record<string, any>>>({});

  // Data user dan key dari data user
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [userKeys, setUserKeys] = useState<string[]>([]);

  // State untuk cabang
  const [cabangUIDs, setCabangUIDs] = useState<string[]>([]);

  // State untuk modal detail IDs
  const [keyData, setKeyData] = useState<string>("");

  // State untuk sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: "score", order: "desc" });

  // State untuk date filter
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Ambil data kategori dan simpan object data
  useEffect(() => {
    getFromDatabase("report").then(data => data && setReportData(data));
    getFromDatabase("visit").then(data => data && setVisitData(data));
    getFromDatabase("health").then(data => data && setHealthData(data));
    getFromDatabase("training").then(data => data && setTrainingData(data));
  }, [getFromDatabase]);

  // Ambil data user
  useEffect(() => {
    getFromDatabase("user").then((data) => {
      if (data) {
        setUserData(data);
        setUserKeys(Object.keys(data));
      }
    });
  }, [getFromDatabase, user]);

  // Ambil cabang UIDs
  useEffect(() => {
    if (!user?.uid) return;
    getFromDatabase(`cabang/${user.uid}`).then((data) => {
      if (data) setCabangUIDs(Object.keys(data));
    });
  }, [getFromDatabase, user?.uid]);

  // Filter user field berdasarkan cabang
  const filteredUserKeys = useMemo(
    () => userKeys.filter(
      (uid) => userData[uid]?.type === "Field" && cabangUIDs.includes(uid)
    ),
    [userKeys, userData, cabangUIDs]
  );

  // Helper: konversi tanggal input ke timestamp ms
  const toStartMs = (date: string) => date ? new Date(date).setHours(0, 0, 0, 0) : null;
  const toEndMs = (date: string) => date ? new Date(date).setHours(23, 59, 59, 999) : null;

  // Bangun summaryData full
  const summaryData: Record<string, SummaryData> = useMemo(() => {
    return filteredUserKeys.reduce((acc, uid) => {
      const rIds = Object.keys(reportData[uid] || {});
      const vIds = Object.keys(visitData[uid] || {});
      const hIds = Object.keys(healthData[uid] || {});
      const tIds = Object.keys(trainingData[uid] || {});
      acc[uid] = {
        uid,
        name: userData[uid]?.name || "N/A",
        report: rIds,
        visit: vIds,
        health: hIds,
        training: tIds,
        score: rIds.length * 2 + vIds.length * 2 + hIds.length + tIds.length * 5,
      };
      return acc;
    }, {} as Record<string, SummaryData>);
  }, [filteredUserKeys, reportData, visitData, healthData, trainingData, userData]);

  // Aplikasikan date filter -> filteredSummaryData
  const filteredSummaryData = useMemo(() => {
    const startMs = toStartMs(startDate);
    const endMs = toEndMs(endDate);
    const result: Record<string, SummaryData> = {};
    Object.entries(summaryData).forEach(([uid, data]) => {
      const filterByDate = (ids: string[]) => ids.filter(id => {
        const ts = parseInt(id);
        if (startMs !== null && ts < startMs) return false;
        if (endMs !== null && ts > endMs) return false;
        return true;
      });
      const r = filterByDate(data.report);
      const v = filterByDate(data.visit);
      const h = filterByDate(data.health);
      const t = filterByDate(data.training);
      result[uid] = {
        ...data,
        report: r,
        visit: v,
        health: h,
        training: t,
        score: r.length * 2 + v.length * 2 + h.length + t.length * 5,
      };
    });
    return result;
  }, [startDate, endDate, summaryData]);

  const summaryKeys = Object.keys(filteredSummaryData);

  // Sorting helper on filtered data
  const sortedKeys = (): string[] => {
    return [...summaryKeys].sort((a, b) => {
      const field = sortConfig.column;
      const aVal = filteredSummaryData[a][field];
      const bVal = filteredSummaryData[b][field];
      const aNum = Array.isArray(aVal) ? aVal.length : (aVal as number);
      const bNum = Array.isArray(bVal) ? bVal.length : (bVal as number);
      return sortConfig.order === "asc" ? aNum - bNum : bNum - aNum;
    });
  };

  // Handle sort
  const handleSort = (column: keyof SummaryData) => {
    setSortConfig(prev =>
      prev.column === column
        ? { column, order: prev.order === "asc" ? "desc" : "asc" }
        : { column, order: "asc" }
    );
  };

  // Export to Excel menggunakan filteredSummaryData
  const handleExportReport = () => {
    const exportData = summaryKeys.map(uid => {
      const d = filteredSummaryData[uid];
      return {
        UserID: uid,
        Name: d.name,
        ReportCount: d.report.length,
        VisitCount: d.visit.length,
        HealthCount: d.health.length,
        TrainingCount: d.training.length,
        Score: d.score,
        ReportIDs: d.report.join(", "),
        VisitIDs: d.visit.join(", "),
        HealthIDs: d.health.join(", "),
        TrainingIDs: d.training.join(", "),
      };
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PodiumSummary");
    XLSX.writeFile(wb, "podium_summary.xlsx");
  };

  function formatDate(msTimestamp: number): string {
    const d = new Date(msTimestamp);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="w-10/12 mx-auto pt-8">
      {/* Filter Tanggal */}
      <div className="flex items-center space-x-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Dari Tanggal:</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="mt-1 block border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Sampai Tanggal:</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="mt-1 block border p-2 rounded"
          />
        </div>
        <button
          onClick={() => { setStartDate(''); setEndDate(''); }}
          className="mt-6 px-3 py-1 bg-gray-300 rounded"
        >Reset</button>
      </div>

      {/* Modal Info */}
      {keyData && (
        <div
          onClick={() => setKeyData("")}
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-lg p-6 max-w-lg w-full relative"
          >
            <button
              onClick={() => setKeyData("")}
              className="absolute top-2 right-2"
            >
              <MdClose className="text-2xl text-gray-600" />
            </button>
            <h3 className="text-xl font-semibold mb-4">{filteredSummaryData[keyData].name}</h3>
            <div className="space-y-3">
              <div>
                <p className="mt-4 font-semibold">{filteredSummaryData[keyData].report.length} Investigasi</p>
                <div className="flex flex-col gap-2 mt-2">
                  {filteredSummaryData[keyData].report.map(id => (
                    <div className="flex justify-between items-center" key={id}>
                      <span className="text-xs w-1/6">{formatDate(parseInt(id))}</span><span className="text-sm w-full ml-8">{reportData[keyData][id]?.customerName}</span><Link target="_blank" to={`/dealer/report/${keyData}/${id}`}><MdArrowOutward className="text-xl bg-primary rounded-full p-1 text-white cursor-pointer" /></Link>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mt-4 font-semibold">{filteredSummaryData[keyData].visit.length} Reguler Visit</p>
                <div className="flex flex-col gap-2 mt-2">
                  {filteredSummaryData[keyData].visit.map(id => (
                    <div className="flex justify-between items-center" key={id}>
                      <span className="text-xs w-1/6">{formatDate(parseInt(id))}</span><span className="text-sm w-full ml-8">{visitData[keyData][id]?.customerName}</span><Link target="_blank" to={`/dealer/visit/${keyData}/${id}`}><MdArrowOutward className="text-xl bg-primary rounded-full p-1 text-white cursor-pointer" /></Link>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mt-4 font-semibold">{filteredSummaryData[keyData].health.length} Health Report</p>
                <div className="flex flex-col gap-2 mt-2">
                  {filteredSummaryData[keyData].health.map(id => (
                    <div className="flex justify-between items-center" key={id}>
                      <span className="text-xs w-1/6">{formatDate(parseInt(id))}</span><span className="text-sm w-full ml-8">{healthData[keyData][id]?.customerName}</span><Link target="_blank" to={`/dealer/health/${keyData}/${id}`}><MdArrowOutward className="text-xl bg-primary rounded-full p-1 text-white cursor-pointer" /></Link>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mt-4 font-semibold">{filteredSummaryData[keyData].training.length} Training Report</p>
                <div className="flex flex-col gap-2 mt-2">
                  {filteredSummaryData[keyData].training.map(id => (
                    <div className="flex justify-between items-center" key={id}>
                      <span className="text-xs w-1/6">{formatDate(parseInt(id))}</span><span className="text-sm w-full ml-8">{trainingData[keyData][id]?.customerName}</span><Link target="_blank" to={`/dealer/training/${keyData}/${id}`}><MdArrowOutward className="text-xl bg-primary rounded-full p-1 text-white cursor-pointer" /></Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between py-8">
        <p>Total User: {summaryKeys.length}</p>
        <button
          onClick={handleExportReport}
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
        >
          <span className="text-2xl mr-2"><MdDownload /></span>
          Export Summary
        </button>
      </div>

      {/* Tabel Summary Data */}
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow w-full">
          <thead>
            <tr className="bg-slate-50 font-bold text-sm md:text-md">
              <th className="border p-4 whitespace-nowrap text-gray-900">#</th>
              <th className="cursor-pointer border p-4" onClick={() => handleSort("name")}>Nama {sortConfig.column === "name" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}</th>
              <th className="cursor-pointer border p-4" onClick={() => handleSort("report")}>Report {sortConfig.column === "report" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}</th>
              <th className="cursor-pointer border p-4" onClick={() => handleSort("visit")}>Visit {sortConfig.column === "visit" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}</th>
              <th className="cursor-pointer border p-4" onClick={() => handleSort("health")}>Health {sortConfig.column === "health" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}</th>
              <th className="cursor-pointer border p-4" onClick={() => handleSort("training")}>Training {sortConfig.column === "training" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}</th>
              <th className="cursor-pointer border p-4" onClick={() => handleSort("score")}>Score {sortConfig.column === "score" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}</th>
              <th className="border p-4 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedKeys().map((uid, i) => (
              <tr key={uid} className="text-gray-700 text-sm md:text-md">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4">{filteredSummaryData[uid].name}</td>
                <td className="border p-4">{filteredSummaryData[uid].report.length}</td>
                <td className="border p-4">{filteredSummaryData[uid].visit.length}</td>
                <td className="border p-4">{filteredSummaryData[uid].health.length}</td>
                <td className="border p-4">{filteredSummaryData[uid].training.length}</td>
                <td className="border p-4">{filteredSummaryData[uid].score}</td>
                <td className="border p-4 flex justify-center items-center">
                  <button
                    onClick={() => setKeyData(uid)}
                    className="p-1.5 text-lg rounded-full bg-emerald-100 text-emerald-900"
                  ><MdPrint /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealerPodium;