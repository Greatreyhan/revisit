import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdClose, MdEdit } from "react-icons/md";
import { useFirebase } from "../../../utils/FirebaseContext";
import { DealerData } from "../../../utils/masterData";

// Tipe untuk summary data tiap user
interface SummaryData {
  name: string;
  dealer: string;
  report: number;
  visit: number;
  health: number;
  training: number;
  score: number;
}

// Tipe untuk konfigurasi sorting
interface SortConfig {
  column: keyof SummaryData;
  order: "asc" | "desc";
}

const ProfilePodium: React.FC = () => {
  const { getFromDatabase, user } = useFirebase();

  // State untuk data kategori
  const [report, setReport] = useState<Record<string, number>>({});
  const [visit, setVisit] = useState<Record<string, number>>({});
  const [health, setHealth] = useState<Record<string, number>>({});
  const [training, setTraining] = useState<Record<string, number>>({});

  // Data user dan key dari data user
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [userKeys, setUserKeys] = useState<string[]>([]);
  
  // State modal
  const [keyData, setKeyData] = useState<string>("");

  // State untuk sorting
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: "score", order: "desc" });

  // State untuk filter dealer
  const [filterDealer, setFilterDealer] = useState<string>("");

  // Ambil data report
  useEffect(() => {
    getFromDatabase("report").then((data) => {
      if (data) {
        const reportCount: Record<string, number> = {};
        Object.keys(data).forEach((uid) => {
          reportCount[uid] = Object.keys(data[uid]).length;
        });
        setReport(reportCount);
      }
    });
  }, [getFromDatabase]);

  // Ambil data visit
  useEffect(() => {
    getFromDatabase("visit").then((data) => {
      if (data) {
        const visitCount: Record<string, number> = {};
        Object.keys(data).forEach((uid) => {
          visitCount[uid] = Object.keys(data[uid]).length;
        });
        setVisit(visitCount);
      }
    });
  }, [getFromDatabase]);

  // Ambil data health
  useEffect(() => {
    getFromDatabase("health").then((data) => {
      if (data) {
        const healthCount: Record<string, number> = {};
        Object.keys(data).forEach((uid) => {
          healthCount[uid] = Object.keys(data[uid]).length;
        });
        setHealth(healthCount);
      }
    });
  }, [getFromDatabase]);

  // Ambil data training
  useEffect(() => {
    getFromDatabase("training").then((data) => {
      if (data) {
        const trainingCount: Record<string, number> = {};
        Object.keys(data).forEach((uid) => {
          trainingCount[uid] = Object.keys(data[uid]).length;
        });
        setTraining(trainingCount);
      }
    });
  }, [getFromDatabase]);

  // Ambil data user
  useEffect(() => {
    getFromDatabase("user").then((data) => {
      if (data) {
        const keys = Object.keys(data);
        setUserData(data);
        setUserKeys(keys);
      }
    });
  }, [getFromDatabase, user]);

  // Filter data user hanya yang memiliki type "Field"
  const fieldUserKeys = userKeys.filter((uid) => userData[uid]?.type === "Field");

  // Membuat summary data untuk user yang sudah difilter, serta menghitung score
  const summaryData: Record<string, SummaryData> = fieldUserKeys.reduce((acc, uid) => {
    const reportCount = report[uid] || 0;
    const visitCount = visit[uid] || 0;
    const healthCount = health[uid] || 0;
    const trainingCount = training[uid] || 0;
    acc[uid] = {
      name: userData[uid]?.name || "N/A",
      dealer: userData[uid]?.location || "N/A",
      report: reportCount,
      visit: visitCount,
      health: healthCount,
      training: trainingCount,
      score: reportCount*2 + visitCount*2 + healthCount + trainingCount*5,
    };
    return acc;
  }, {} as Record<string, SummaryData>);

  // Array untuk iterasi tabel hanya pada user yang difilter
  const summaryKeys = Object.keys(summaryData);

  // Apply dealer filter pada daftar kunci
  const filteredKeys = summaryKeys.filter(
    (uid) => !filterDealer || summaryData[uid].dealer === filterDealer
  );

  // Fungsi untuk mengurutkan data sesuai konfigurasi sortConfig
  const sortedKeys = (): string[] => {
    const keysArray = [...filteredKeys];
    keysArray.sort((a, b) => {
      const field = sortConfig.column;
      const aValue = summaryData[a][field];
      const bValue = summaryData[b][field];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.order === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        const cmp = String(aValue).localeCompare(String(bValue));
        return sortConfig.order === "asc" ? cmp : -cmp;
      }
    });
    return keysArray;
  };

  // Handler untuk mengubah sorting ketika header tabel diklik
  const handleSort = (column: keyof SummaryData) => {
    setSortConfig((prev) => {
      if (prev.column === column) {
        return { column, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { column, order: "asc" };
    });
  };

  return (
    <div className="md:w-10/12 w-full mx-auto pt-8">
      {/* Modal Info (tidak diubah) */}
      <div
        onClick={() => setKeyData("")}
        className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${
          keyData === "" ? "hidden" : "flex"
        } justify-center items-center`}
      >
        <div className="pb-6 bg-slate-50 rounded-lg flex flex-col">
          <div className="relative">
            <button
              onClick={() => setKeyData("")}
              className="absolute right-0 top-0"
              type="button"
            >
              <MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" />
            </button>
            <table className="w-full">
              {/* ... modal content unchanged ... */}
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-sky-800 px-4 py-2 rounded-lg bg-sky-100 flex items-center"
                to={`/profile/editor/${keyData}`}
              >
                <MdEdit className="text-md mr-1" />
                <p className="text-sm">Edit Data</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Dealer & Header */}
      <div className="flex items-center justify-between py-8 md:px-0 px-2">
        <p className="px-4 py-2 rounded-md bg-slate-100"><span className="text-sm pr-2">Total User :</span> <span className="font-bold text-primary-dark">{filteredKeys.length}</span></p>
        <select
          value={filterDealer}
          onChange={(e) => setFilterDealer(e.target.value)}
          className="border rounded px-4 py-2 md:text-base text-sm"
        >
          <option value="">All Dealer</option>
          {DealerData.map((dealer) => (
            <option key={dealer} value={dealer}>
              {dealer}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel Summary Data (tidak diubah) */}
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow w-full">
          <thead>
            <tr className="bg-slate-50 font-bold text-sm md:text-md">
              <th className="border p-4 whitespace-nowrap text-gray-900">#</th>
              <th
                className="cursor-pointer border p-4 whitespace-nowrap text-gray-900"
                onClick={() => handleSort("name")}
              >
                Nama {sortConfig.column === "name" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}
              </th>
              <th
                className="cursor-pointer border p-4 whitespace-nowrap text-gray-900 md:table-cell hidden"
                onClick={() => handleSort("name")}
              >
                Dealer {sortConfig.column === "dealer" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}
              </th>
              <th
                className="cursor-pointer border w-32 whitespace-nowrap text-gray-900"
                onClick={() => handleSort("report")}
              >
                Report {sortConfig.column === "report" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}
              </th>
              <th
                className="cursor-pointer border w-32 whitespace-nowrap text-gray-900"
                onClick={() => handleSort("visit")}
              >
                Visit {sortConfig.column === "visit" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}
              </th>
              <th
                className="cursor-pointer border w-32 whitespace-nowrap text-gray-900"
                onClick={() => handleSort("health")}
              >
                Health {sortConfig.column === "health" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}
              </th>
              <th
                className="cursor-pointer border w-32 whitespace-nowrap text-gray-900"
                onClick={() => handleSort("training")}
              >
                Training {sortConfig.column === "training" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}
              </th>
              <th
                className="cursor-pointer border w-32 whitespace-nowrap text-gray-900"
                onClick={() => handleSort("score")}
              >
                Score {sortConfig.column === "score" ? (sortConfig.order === "asc" ? "↓" : "↑") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedKeys().map((uid, i) => (
              <tr key={uid} className="text-gray-700">
                <td className="border p-4 text-xs md:text-sm">{i + 1}</td>
                <td className="border p-4 text-xs md:text-sm capitalize">{summaryData[uid].name.toLocaleLowerCase()}</td>
                <td className="border p-4 text-xs md:text-sm md:table-cell hidden capitalize">{summaryData[uid].dealer.toLocaleLowerCase()}</td>
                <td className="border text-xs md:text-sm text-center">{summaryData[uid].report}</td>
                <td className="border text-xs md:text-sm text-center">{summaryData[uid].visit}</td>
                <td className="border text-xs md:text-sm text-center">{summaryData[uid].health}</td>
                <td className="border text-xs md:text-sm text-center">{summaryData[uid].training}</td>
                <td className="border text-xs md:text-sm text-center">{summaryData[uid].score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePodium;
