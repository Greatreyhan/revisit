import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdClose, MdDangerous, MdGppGood, MdMap } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { ScheduleData } from "../interface/Schedule";
import { IoMdSettings } from "react-icons/io";

const DealerSchedule = () => {
  const { getFromDatabase, user } = useFirebase();
  const [allSchedules, setAllSchedules] = useState<ScheduleData[]>([]);
  const [keyData, setKeyData] = useState<number>(-1)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
  
      try {
        // Ambil daftar cabang yang terkait dengan user
        const cabangData = await getFromDatabase(`cabang/${user.uid}`);
        const keys = cabangData ? Object.keys(cabangData) : [];
    
        // Ambil semua data schedule
        const scheduleData = await getFromDatabase("schedule/");
        if (!scheduleData) return;
    
        const scheduleArray: ScheduleData[] = [];
  
        Object.entries(scheduleData).forEach(([userId, schedules]) => {
          // Hanya proses jika userId ada di keys
          if (keys.includes(userId)) {
            Object.entries(schedules as Record<string, any>).forEach(([scheduleId, scheduleDetail]) => {
              scheduleArray.push({ userId, scheduleId, ...(scheduleDetail as ScheduleData) });
            });
          }
        });
  
        setAllSchedules(scheduleArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user?.uid]);
  

  const formatDate = (date: string) => {
    const formDate = new Date(date);
    const datePart = `${formDate.getDate()} ${formDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;

    return `${datePart}`;
  };

  return (
    <div className="md:w-10/12 w-11/12 mx-auto pt-8">
      <div onClick={() => setKeyData(-1)} className={`fixed w-screen h-screen bg-black top-0 left-0 bg-opacity-40 ${keyData == -1 ? "hidden" : "flex"} justify-center items-center`}>
        <div className={`pb-6 bg-slate-50 w-11/12 rounded-lg flex flex-col`}>
          <div className="relative">
            <button onClick={() => setKeyData(-1)} className="absolute right-0 top-0" type="button"><MdClose className="text-5xl bg-red-700 text-white p-3 rounded-tr-lg" /></button>
            <table className="w-full">
              <thead>
                <tr className="">
                  <td className="font-semibold py-3 px-6 rounded-t-lg bg-slate-100" colSpan={2}>Schedule Information</td>
                </tr>
              </thead>
              <tbody className="">
                <tr className="text-left w-full">
                  <td className="px-6 w-4/12 p-2">Customer</td>
                  <td className=" w-10/12 p-2">: {allSchedules[keyData]?.customer}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-4/12 p-2">Date Start</td>
                  <td className=" w-10/12 p-2">: {formatDate(allSchedules[keyData]?.dateStart)}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-4/12 p-2">Date End</td>
                  <td className=" w-10/12 p-2">: {formatDate(allSchedules[keyData]?.dateEnd)}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="px-6 w-4/12 p-2">Address</td>
                  <td className=" w-10/12 p-2">: {allSchedules[keyData]?.address}</td>
                </tr>
              </tbody>
            </table>
            <hr className="mt-8" />

          </div>
        </div>
      </div>
      <div className="flex items-center justify-between py-8">
        <p>Total Schedule: {allSchedules.length}</p>
        <Link
          className="inline-flex items-center px-6 py-1.5 bg-primary rounded-full text-white"
          to={"/dealer/schedule/map"}
        >
          <span className="text-2xl mr-2"><MdMap /></span>View Map
        </Link>
      </div>
      <div className="flex justify-center items-center">
        <table className="table p-4 bg-white rounded-lg shadow">
          <thead>
            <tr className="md:text-md text-sm bg-slate-50 font-bold">
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">#</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Customer</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Date</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 hidden md:table-cell">Address</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Status</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900 hidden md:table-cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {allSchedules.map((data, i) => (
              <tr key={data?.scheduleId} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{data?.customer}</td>
                <td className="border-b p-4 dark:border-dark-5 flex flex-col h-full gap-1 items-center justify-center"><span className="bg-sky-100 px-4 py-1 rounded-lg">{formatDate(data?.dateStart)}</span><span className="bg-rose-100 px-4 py-1 rounded-lg">{formatDate(data?.dateEnd)}</span></td>
                <td className="border p-4 dark:border-dark-5 hidden md:table-cell">{data?.address}</td>
                <td className="border p-4 dark:border-dark-5">{data?.status == 'pending' ? <MdDangerous className="w-full text-xl text-rose-700" /> : <MdGppGood className="w-full text-xl text-emerald-700" />}</td>
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

export default DealerSchedule;
