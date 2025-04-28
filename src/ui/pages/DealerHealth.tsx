import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdClose, MdDownload } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { HealthReportData } from "../interface/Health";
import * as XLSX from "xlsx";

const DealerHealth = () => {
  const { getFromDatabase, user } = useFirebase();
  const [data, setData] = useState<{ [key: string]: HealthReportData }>({});
  const [keys, setKeys] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string>(""
);  
  // State untuk filter tanggal
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchTrainingData = async () => {
      if (!user?.uid) return;
      try {
        const cabangData = await getFromDatabase(`cabang/${user.uid}`);
        const cabangKeys = cabangData ? Object.keys(cabangData) : [];

        const healthData = await getFromDatabase("health");
        if (!healthData) return;

        const filteredTraining: Record<string, HealthReportData & { healthId: string; userId: string }> = {};
        Object.entries(healthData).forEach(([userId, healthObj]) => {
          if (cabangKeys.includes(userId)) {
            Object.entries(healthObj as Record<string, any>).forEach(([healthId, healthDetail]) => {
              filteredTraining[healthId] = { ...healthDetail, healthId, userId };
            });
          }
        });

        setData(filteredTraining);
        setKeys(Object.keys(filteredTraining));
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    fetchTrainingData();
  }, [user?.uid, getFromDatabase]);

  // Filter data by date based on key (timestamp)
  const filteredKeys = keys.filter((k) => {
    const timestamp = parseInt(k, 10);
    if (isNaN(timestamp)) return false;

    if (startDate) {
      const startTs = new Date(startDate).getTime();
      if (timestamp < startTs) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (timestamp > end.getTime()) return false;
    }
    return true;
  });

  // Fungsi export report ke Excel
  const handleExportReport = () => {
    const exportArr = filteredKeys.map((key) => {
      const health = data[key];
      const { attachments, ...rest } = health;
      const attachmentsString =
        Array.isArray(attachments) && attachments.length > 0
          ? attachments
              .map(
                (att, idx) =>
                  `Attachment ${idx + 1}: ImageId: ${att.imageId}, URL: ${att.imageAttached}, Description: ${att.imageDescription}`
              )
              .join("; ")
          : "";
      return {
        HealthID: key,
        ...rest,
        Attachments: attachmentsString,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportArr);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HealthReport");
    XLSX.writeFile(workbook, "health_report.xlsx");
  };

  return (
    <div className="w-10/12 mx-auto pt-8">
      {/* Kontrol Filter Tanggal */}
      <div className="flex gap-4 items-center mb-6">
        <label>
          <span className="mr-2">Start Date:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-1"
          />
        </label>
        <label>
          <span className="mr-2">End Date:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-1"
          />
        </label>
      </div>

      {/* Modal Report Info */}
      <div
        onClick={() => setKeyData("")}
        className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${
          keyData === "" ? "hidden" : "flex"
        } justify-center items-center`}
      >
        <div className="pb-6 bg-slate-50 rounded-lg flex flex-col">
          <div className="relative">
            <button onClick={() => setKeyData("")} className="absolute right-0 top-0" type="button">
              <MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" />
            </button>
            <table className="w-full">
              <thead>
                <tr>
                  <td className="font-semibold py-3 px-6 rounded-t-lg bg-slate-100" colSpan={2}>
                    Health Information
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Nama</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.customerName}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Type</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.typeUnit}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Segment</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.segment}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Rear Body Type</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.rearBodyType}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-sky-800 px-4 py-2 rounded-lg bg-sky-100 flex items-center"
                to={`/dealer/health/${data[keyData]?.userId}/${keyData}`}
              >
                <MdEdit className="text-md mr-1" />
                <p className="text-sm">Edit Data</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header & Export */}
      <div className="flex items-center justify-between py-8">
        <p>Total Health: {filteredKeys.length}</p>
        <button
          onClick={handleExportReport}
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
        >
          <MdDownload className="text-2xl mr-2" />
          Export Report
        </button>
      </div>

      {/* Tabel Data */}
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4">#</th>
              <th className="border p-4">Nama</th>
              <th className="border p-4 md:table-cell hidden">Segment</th>
              <th className="border p-4">Type</th>
              <th className="border p-4 md:table-cell hidden">Rear Body Type</th>
              <th className="border p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeys.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4">{data[key]?.customerName}</td>
                <td className="border p-4 md:table-cell hidden">{data[key]?.segment}</td>
                <td className="border p-4">{data[key]?.typeUnit}</td>
                <td className="border p-4 md:table-cell hidden">{data[key]?.rearBodyType}</td>
                <td className="border-t p-4 flex gap-x-3 justify-around items-center">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={`/dealer/health/${data[key]?.userId}/${key}`}
                  >
                    <MdEdit />
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

export default DealerHealth;
