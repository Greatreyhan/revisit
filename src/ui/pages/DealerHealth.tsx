import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdDelete, MdClose, MdDownload } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { IoMdSettings } from "react-icons/io";
import { HealthReportData } from "../interface/Health";

const DealerHealth = () => {
  const { getFromDatabase, deleteFromDatabase, user } = useFirebase();
  const [dataArticle, setDataArticle] = useState<{ [key: string]: HealthReportData }>({});
  const [keyArticle, setKeyArticle] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string>("");
  const [deleteKey, setDeleteKey] = useState<string>("");

useEffect(() => {
    const fetchTrainingData = async () => {
      if (!user?.uid) return;

      try {
        // Ambil daftar cabang yang terkait dengan user.
        const cabangData = await getFromDatabase(`cabang/${user.uid}`);
        const cabangKeys = cabangData ? Object.keys(cabangData) : [];

        const healthData = await getFromDatabase(`health`);
        if (!healthData) return;

        // Filter data training agar hanya menyertakan training yang berasal dari cabang yang sesuai.
        const filteredTraining: Record<string, HealthReportData & { trainingId: string; cabangId: string }> = {};

        Object.entries(healthData).forEach(([cabangId, healthObj]) => {
          if (cabangKeys.includes(cabangId)) {
            Object.entries(healthObj as Record<string, any>).forEach(([healthId, healthDetail]) => {
              filteredTraining[healthId] = { ...healthDetail, healthId, cabangId };
            });
          }
        });

        // Set data ke state.
        setDataArticle(filteredTraining);
        setKeyArticle(Object.keys(filteredTraining));
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    fetchTrainingData();
  }, [user?.uid, getFromDatabase]);

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
                  <td className="w-10/12 p-2">: {dataArticle[keyData]?.customerName}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Type</td>
                  <td className="w-10/12 p-2">: {dataArticle[keyData]?.typeUnit}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Segment</td>
                  <td className="w-10/12 p-2">: {dataArticle[keyData]?.segment}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Rear Body Type</td>
                  <td className="w-10/12 p-2">: {dataArticle[keyData]?.rearBodyType}</td>
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

              {/* Tombol delete pada modal info: buka modal konfirmasi delete */}
              <button
                className="text-rose-800 px-4 py-2 rounded-lg bg-rose-100 flex items-center"
                type="button"
                onClick={() => {
                  setDeleteKey(keyData);
                  setKeyData("");
                }}
              >
                <MdDelete className="text-md mr-1" />
                <p className="text-sm">Delete Data</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-8">
        <p>Total Health: {keyArticle.length}</p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/health/editor"}
        >
          <span className="text-2xl mr-2"><MdDownload /></span>Export Report
        </Link>
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
            {keyArticle.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4">{dataArticle[key]?.customerName}</td>
                <td className="border p-4 md:table-cell hidden">
                  {dataArticle[key]?.segment}
                </td>
                <td className="border p-4">{dataArticle[key]?.typeUnit}</td>
                <td className="border p-4 md:table-cell hidden">{dataArticle[key]?.rearBodyType}</td>
                <td className="border-t p-4 md:flex gap-x-3 justify-around items-center hidden">
                  <Link
                    className="p-2 text-sky-800 rounded-full bg-sky-100"
                    to={"/health/editor/" + key}
                  >
                    <MdEdit />
                  </Link>
                  {/* Tombol delete: buka modal konfirmasi delete */}
                  <button
                    className="p-2 text-rose-800 rounded-full bg-rose-100"
                    type="button"
                    onClick={() => setDeleteKey(key)}
                  >
                    <MdDelete />
                  </button>
                  {/* <Link
                    className="p-2 text-green-800 rounded-full bg-green-100"
                    to={"/health/view/" + key}
                  >
                    <MdPrint />
                  </Link> */}
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

export default DealerHealth;
