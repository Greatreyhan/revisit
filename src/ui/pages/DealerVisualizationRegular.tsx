import React, { useEffect, useState } from "react";
import { useFirebase } from "../../utils/FirebaseContext";
import { MdFilterAlt, MdOutlineClose } from "react-icons/md";
import { BiSave } from "react-icons/bi";
import RegularVisitMap from "../organisms/RegularVisitMap";
import { VisitData } from "../interface/Visit";


const DealerVisuzalizationRegular: React.FC = () => {
  const { getFromDatabase, user } = useFirebase();
  const [filteredReports, setFilteredReports] = useState<VisitData[]>([]);

  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);

  const [visitReports, setVisitReports] = useState<VisitData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
  
      try {
        // Ambil daftar cabang yang terkait dengan user
        const cabangData = await getFromDatabase(`cabang/${user.uid}`);
        const keys = cabangData ? Object.keys(cabangData) : [];
    
        // Ambil semua data schedule
        const visitData = await getFromDatabase("visit/");
        if (!visitData) return;
    
        const visitArray: VisitData[] = [];
  
        Object.entries(visitData).forEach(([userId, visits]) => {
          if (keys.includes(userId)) {
            Object.entries(visits as Record<string, any>).forEach(([reportId, visitDetail]) => {
              visitArray.push({ userId, reportId, ...(visitDetail as VisitData) });
            });
          }
        });
  
        setVisitReports(visitArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user?.uid]);

  // Function to apply filters
  useEffect(() => {
    const filterReports = () => {

      const filtered = visitReports
      setFilteredReports(filtered);
      console.log(filteredReports)
    };

    if (isDataChanged) {
      filterReports();
      setIsDataChanged(false);
    }
  }, []);

  // const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  //   setter(e.target.value);
  // };

  return (
    <div className="w-10/12 mx-auto flex flex-wrap justify-start pt-16 gap-10 bg-white">
      <div className="w-full flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setIsShow(true)}
          className="mt-4 px-6 py-3 inline-flex justify-center items-center bg-primary rounded-full text-white"
        >
          <span className="mr-1">Filter Data</span> <MdFilterAlt className="text-2xl" />
        </button>
      </div>

      <div className={`fixed ${isShow ? "flex" : "hidden"} z-30 justify-center items-center bg-black bg-opacity-80 w-screen h-screen top-0 left-0 overflow-y-auto`}>
        <form className="w-10/12 mt-32 relative">
          <button type="button" onClick={() => setIsShow(false)} className="absolute top-4 right-0 bg-red-700 p-3 rounded-tr-lg"><MdOutlineClose className="text-3xl font-semibold text-white" /></button>
          <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
            <h2 className="font-semibold">Filter</h2>
             <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => { setIsDataChanged(true); setIsShow(false) }}
                className="mt-4 px-6 py-3 inline-flex justify-center items-center bg-primary rounded-full text-white"
              >
                <span className="mr-1">Filter</span> <BiSave className="text-2xl" />
              </button>
            </div>
          </div>
        </form>
      </div>

      <div>
        <RegularVisitMap setVisitReports={setVisitReports} visitReports={visitReports} />
      </div>


    </div>
  );
};

export default DealerVisuzalizationRegular;
