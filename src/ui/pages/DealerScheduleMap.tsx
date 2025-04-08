import { useEffect, useState } from "react";
import { useFirebase } from "../../utils/FirebaseContext";
import { ScheduleData } from "../interface/Schedule";
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import Loading from "../molecules/Loading";
import { Link } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";

const center = {
  lat: -6.200000,
  lng: 106.816666,
};

const containerStyle = {
  width: '100%',
  height: '100%',
};


const DealerScheduleMap = () => {
  const { getFromDatabase, user } = useFirebase();
  const [allSchedules, setAllSchedules] = useState<ScheduleData[]>([]);
  const [selectedData, setSelectedData] = useState<ScheduleData>()
  const [showStatus, setShowStatus] = useState("pending")
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

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

  if (!isLoaded) {
    return <Loading />;
  }

  const handleSelect = (status: string) => {
    setShowStatus(status);
  };

  return (
    <div className="flex fixed z-50 left-0 top-0 w-screen h-screen">
      <div className="flex fixed z-50 top-3 w-full justify-center ">
        <Link
          to="/admin/schedule"
          className={`px-6 py-2 flex justify-center items-center mx-4 rounded-full border-r bg-white backdrop-blur-lg text-black}`}
        >
          <IoMdReturnLeft />
        </Link>
        <button
          className={`px-6 py-2 rounded-l-full border-r ${showStatus === "done" ? "bg-slate-200 backdrop-blur-lg bg-opacity-50 text-black" : "bg-white text-black"
            }`}
          onClick={() => handleSelect("done")}
        >
          Done
        </button>
        <button
          className={`px-6 py-2 border-r  ${showStatus === "pending" ? "bg-slate-200 backdrop-blur-lg bg-opacity-50 text-black" : "bg-white text-black"
            }`}
          onClick={() => handleSelect("pending")}
        >
          Pending
        </button>
        <button
          className={`px-6 py-2 rounded-r-full ${showStatus === "all" ? "bg-slate-200 backdrop-blur-lg bg-opacity-50 text-black" : "bg-white text-black"
            }`}
          onClick={() => handleSelect("all")}
        >
          All
        </button>
      </div>
      <div className={`${selectedData ? "block" : "hidden"} fixed bottom-0 left-0 z-10 bg-white px-8 py-6 rounded-tr`}>
        <table className={`text-sm mt-2`}>
          <tbody className="w-full">
          <tr className="text-left w-full">
              <td className="font-semibold">Dealer</td>
              <td className="pl-8">{selectedData?.dealer}</td>
            </tr>
            <tr className="text-left w-full">
              <td className="font-semibold">Customer</td>
              <td className="pl-8">{selectedData?.customer}</td>
            </tr>
            <tr className="text-left w-full">
              <td className="font-semibold">Visit on</td>
              <td className="pl-8">{selectedData?.dateEnd}</td>
            </tr>
            <tr className="text-left w-full">
              <td className="font-semibold">Type</td>
              <td className="pl-8">{selectedData?.type}</td>
            </tr>
            <tr className="text-left w-full">
              <td className="font-semibold">Address</td>
              <td className="pl-8">{selectedData?.address}</td>
            </tr>
            <tr className="text-left w-full">
              <td className="font-semibold">Status</td>
              <td className="pl-8">{selectedData?.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={`w-full h-full items-center`}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={8}
          center={center}
        >
          {allSchedules?.map((data, index) => (
            data?.mapMarkers && data?.status !== showStatus ?
              <Marker
                key={index}
                position={data?.mapMarkers[0]}
                icon={data.type === "reguler" ? { url: "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='40' height='40'><path fill='%23007bff' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 12c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'/></svg>" } : { url: "data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='40' height='40'><path fill='%23ff0000' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 12c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'/></svg>" }}
                onClick={() => setSelectedData(data)}
              />
              :
              <div></div>
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default DealerScheduleMap;
