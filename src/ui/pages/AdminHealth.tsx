import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdClose, MdDownload } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useFirebase } from "../../utils/FirebaseContext";
import { HealthReportData } from "../interface/Health";
import * as XLSX from "xlsx";

const AdminHealth = () => {
  const { getFromDatabase, user } = useFirebase();
  const [data, setData] = useState<{ [key: string]: HealthReportData }>({});
  const [key, setKey] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string>("");

  useEffect(() => {
    const fetchHealthData = async () => {
      if (!user?.uid) return;

      try {
        const healthData = await getFromDatabase(`health`);
        if (!healthData) return;
      
        // Kumpulkan seluruh data health tanpa filter cabang.
        const filteredHealth: Record<string, HealthReportData & { healthId: string; userId: string }> = {};
      
        Object.entries(healthData).forEach(([userId, healthObj]) => {
          Object.entries(healthObj as Record<string, any>).forEach(([healthId, healthDetail]) => {
            filteredHealth[healthId] = { ...healthDetail, healthId, userId };
          });
        });
      
        // Set data ke state.
        setData(filteredHealth);
        setKey(Object.keys(filteredHealth));
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    fetchHealthData();
  }, [user?.uid, getFromDatabase]);

  // Fungsi untuk export report data health ke Excel
  const handleExportReport = () => {
    // Ubah data yang berbentuk objek menjadi array objek
    const dataArr = Object.entries(data).map(([key, health]) => {
      // Jika ada field attachments (misalnya array objek), kita flatten dengan custom mapping.
      const { attachments, ...rest } = health;
      const attachmentsString =
        Array.isArray(attachments) && attachments.length > 0
          ? attachments
              .map(
                (att, index) =>
                  `Attachment ${index + 1}: ImageId: ${att.imageId}, URL: ${att.imageAttached}, Description: ${att.imageDescription}`
              )
              .join("; ")
          : "";

      return {
        HealthID: key,
        ...rest,
        Attachments: attachmentsString,
      };
    });

    console.log("Export data array:", dataArr);

    // Konversi array data ke sheet Excel
    const worksheet = XLSX.utils.json_to_sheet(dataArr);
    // Buat workbook baru dan tambahkan sheet dengan nama "HealthReport"
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HealthReport");
    // Simpan file Excel dengan nama "health_report.xlsx"
    XLSX.writeFile(workbook, "health_report.xlsx");
  };

  return (
    <div className="w-10/12 mx-auto pt-8">
      
      {/* Modal Report Info */}
      <div onClick={() => setKeyData("")} className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${keyData === "" ? "hidden" : "flex"} justify-center items-center`}>
        <div className={`pb-6 bg-slate-50 rounded-lg flex flex-col`}>
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
                to={"/health/editor/" + keyData}
              >
                <MdEdit className="text-md mr-1" />
                <p className="text-sm">Edit Data</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-8">
        <p>Total Health: {key.length}</p>
        {/* Ganti Link export report dengan tombol yang memanggil handleExportReport */}
        <button
          onClick={handleExportReport}
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
        >
          <span className="text-2xl mr-2"><MdDownload /></span>
          Export Report
        </button>
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Nama</th>
              <th className="border p-4 whitespace-nowrap text-gray-900 md:table-cell hidden">Segment</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Type</th>
              <th className="border p-4 whitespace-nowrap text-gray-900 md:table-cell hidden">Rear Body Type</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {key.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4">{data[key]?.customerName}</td>
                <td className="border p-4 md:table-cell hidden">{data[key]?.segment}</td>
                <td className="border p-4">{data[key]?.typeUnit}</td>
                <td className="border p-4 md:table-cell hidden">{data[key]?.rearBodyType}</td>
                <td className="border-t p-4 md:flex gap-x-3 justify-around items-center hidden">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={`/admin/health/${data[key]?.userId}/${key}`}
                    >
                    <MdEdit />
                  </Link>
                </td>
                <td className="border-t p-4 flex gap-x-3 justify-around items-center md:hidden">
                  <button
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    type="button"
                    onClick={() => setKeyData(key)}
                  >
                    <IoMdSettings />
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

export default AdminHealth;
