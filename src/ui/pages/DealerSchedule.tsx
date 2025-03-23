import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDangerous, MdGppGood, MdMap } from "react-icons/md";
import { useFirebase } from "../../utils/FirebaseContext";
import { ScheduleData } from "../interface/Schedule";

const DealerSchedule = () => {
  const { getFromDatabase, user } = useFirebase();
  const [allSchedules, setAllSchedules] = useState<ScheduleData[]>([]);


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
    <div className="w-10/12 mx-auto pt-8">

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
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Address</th>
              <th className="border p-4 dark:border-dark-5 whitespace-nowrap text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {allSchedules.map((data, i) => (
              <tr key={data?.scheduleId} className="text-gray-700 md:text-md text-sm">
                <td className="border p-4 dark:border-dark-5">{i + 1}</td>
                <td className="border p-4 dark:border-dark-5">{data?.customer}</td>
                <td className="border-b p-4 dark:border-dark-5 flex flex-col h-full gap-1 items-center justify-center"><span className="bg-sky-100 px-4 py-1 rounded-lg">{formatDate(data?.dateStart)}</span><span className="bg-rose-100 px-4 py-1 rounded-lg">{formatDate(data?.dateEnd)}</span></td>
                <td className="border p-4 dark:border-dark-5">{data?.address}</td>
                <td className="border p-4 dark:border-dark-5">{data?.status == 'pending' ? <MdDangerous className="w-full text-xl text-rose-700" /> : <MdGppGood className="w-full text-xl text-emerald-700" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealerSchedule;
