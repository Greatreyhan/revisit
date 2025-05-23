import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdClose, MdDownload } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useFirebase } from "../../../utils/FirebaseContext";
import { TraineeData } from "../../interface/Training";
import * as XLSX from "xlsx";

const DealerTraining = () => {
  const { getFromDatabase, user } = useFirebase();
  // Menyimpan data training yang sudah difilter.
  const [data, setData] = useState<
    Record<string, TraineeData & { trainingId: string; userId: string }>
  >({});
  // Menyimpan daftar key (trainingId) untuk keperluan render pada tabel.
  const [key, setKey] = useState<string[]>([]);
  // State untuk menampilkan modal detail data training.
  const [keyData, setKeyData] = useState<string>("");
  // State untuk menampilkan modal konfirmasi penghapusan.

  useEffect(() => {
    const fetchTrainingData = async () => {
      if (!user?.uid) return;

      try {
        // Ambil daftar cabang yang terkait dengan user.
        const cabangData = await getFromDatabase(`cabang/${user.uid}`);
        const cabangKeys = cabangData ? Object.keys(cabangData) : [];

        const trainingData = await getFromDatabase(`training`);
        if (!trainingData) return;

        // Filter data training agar hanya menyertakan training yang berasal dari cabang yang sesuai.
        const filteredTraining: Record<string, TraineeData & { trainingId: string; userId: string }> = {};

        Object.entries(trainingData).forEach(([userId, trainingObj]) => {
          if (cabangKeys.includes(userId)) {
            Object.entries(trainingObj as Record<string, any>).forEach(([trainingId, trainingDetail]) => {
              filteredTraining[trainingId] = { ...trainingDetail, trainingId, userId };
            });
          }
        });

        // Set data ke state.
        setData(filteredTraining);
        setKey(Object.keys(filteredTraining));
      } catch (error) {
        console.error("Error fetching training data:", error);
      }
    };

    fetchTrainingData();
  }, [user?.uid, getFromDatabase]);

  // Fungsi untuk export report data training ke Excel
  const handleExportReport = () => {

    // Ubah data yang berbentuk objek menjadi array objek
    const dataArr = Object.entries(data).map(([key, training]) => {
      // Destruktur field-field yang perlu diformat
      const { unit, trainee, attachments, ...rest } = training;

      // Format unit: karena unit merupakan array string, cukup join dengan koma
      const unitString =
        Array.isArray(unit) && unit.length > 0 ? unit.join(", ") : "";

      // Format trainee: buat representasi custom untuk setiap trainee
      const traineeString =
        Array.isArray(trainee) && trainee.length > 0
          ? trainee
              .map(
                (t, index) =>
                  `Trainee ${index + 1}: Name: ${t.name}, Position: ${t.position}, Score: ${t.score}, Email: ${t.email}, Phone: ${t.phone}`
              )
              .join("; ")
          : "";

      // Format attachments: gabungkan informasi imageAttached, imageDescription, dan imageId
      const attachmentsString =
        Array.isArray(attachments) && attachments.length > 0
          ? attachments
              .map(
                (att, index) =>
                  `Attachment ${index + 1}: ImageId: ${att.imageId}, URL: ${att.imageAttached}, Description: ${att.imageDescription}`
              )
              .join("; ")
          : "";

      // Hitung Total Trainee dengan menghitung panjang array trainee (jika ada)
      const totalTrainee = Array.isArray(trainee) ? trainee.length : 0;

      // Kembalikan data yang sudah diformat, termasuk TotalTrainee
      return {
        TrainingID: key,
        ...rest,
        Unit: unitString,
        Trainee: traineeString,
        TotalTrainee: totalTrainee,
        Attachments: attachmentsString,
      };
    });

    // Debug: Lihat struktur data yang akan diexport
    console.log("Export data array:", dataArr);

    // Konversi array data ke sheet Excel
    const worksheet = XLSX.utils.json_to_sheet(dataArr);
    // Buat workbook baru
    const workbook = XLSX.utils.book_new();
    // Tambahkan sheet ke workbook dengan nama "TrainingReport"
    XLSX.utils.book_append_sheet(workbook, worksheet, "TrainingReport");
    // Simpan file Excel dengan nama "training_report.xlsx"
    XLSX.writeFile(workbook, "training_report.xlsx");
  };

  return (
    <div className="w-10/12 mx-auto pt-8">
      {/* Modal Info Training */}
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
                    Training Information
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Customer</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.customerName}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Title</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.title}</td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Unit</td>
                  <td className="w-10/12 p-2">
                    : {data[keyData]?.unit ? data[keyData]?.unit.join(", ") : "-"}
                  </td>
                </tr>
                <tr className="text-left">
                  <td className="px-6 w-3/12 p-2">Dealer</td>
                  <td className="w-10/12 p-2">: {data[keyData]?.dealer}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />
            <div className="flex mt-2 gap-3 px-8 pt-4">
              <Link
                className="text-sky-800 px-4 py-2 rounded-lg bg-sky-100 flex items-center"
                to={"/dealer/training/" + data[keyData]?.userId + "/" + keyData}
              >
                <MdEdit className="text-md mr-1" />
                <p className="text-sm">Edit Data</p>
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* Header & Create Training */}
      <div className="flex items-center justify-between py-8">
        <p>Total Training: {key.length}</p>
        {/* Ganti tombol export report dengan memanggil handleExportReport */}
        <button
          onClick={handleExportReport}
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
        >
          <span className="text-2xl mr-2">
            <MdDownload />
          </span>
          Export Report
        </button>
      </div>

      {/* Daftar Training */}
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Customer</th>
              <th className="border p-4 whitespace-nowrap text-gray-900 md:table-cell hidden">Title</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Start Date</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Unit</th>
              <th className="border p-4 whitespace-nowrap text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {key.map((key, i) => (
              <tr key={key} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4">{i + 1}</td>
                <td className="border p-4">{data[key]?.customerName}</td>
                <td className="border p-4 md:table-cell hidden">{data[key]?.title}</td>
                <td className="border p-4">{data[key]?.startDate}</td>
                <td className="border p-4 text-center">
                  {data[key]?.unit ? data[key]?.unit.length : 0}
                </td>
                <td className="border-t p-4 md:flex gap-x-3 justify-around items-center hidden">
                  <Link className="p-2 text-sky-800 rounded-full bg-sky-100" to={"/dealer/training/" + data[key]?.userId + "/" + key}>
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

export default DealerTraining;
