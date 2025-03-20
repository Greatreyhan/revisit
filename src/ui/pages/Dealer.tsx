import React, { useEffect, useState } from "react";
import { useFirebase } from "../../utils/FirebaseContext";
import { ReportData } from "../interface/Report";
import { VisitData } from "../interface/Visit";
import { ScheduleData } from "../interface/Schedule";



const Dealer: React.FC = () => {
  const { getFromDatabase, user } = useFirebase()
  const [keyData, setKeyData] = useState<string[]>([]);
  const [investigation, setInvestigation] = useState<ReportData[]>([]);
  const [visitReport, setVisitReport] = useState<VisitData[]>([]);
  const [allSchedules, setAllSchedules] = useState<ScheduleData[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
  
      try {
        // 1. Fetch keys dari cabang
        const cabangData = await getFromDatabase(`cabang/${user.uid}`);
        const keys = cabangData ? Object.keys(cabangData) : [];
  
        setKeyData(Object.keys(keys));

  
        // 4. Fetch dan filter reports berdasarkan keys
        const reportsData = await getFromDatabase("report/");
        if (reportsData) {
          const filteredReports: ReportData[] = [];
  
          Object.entries(reportsData).forEach(([userId, reports]) => {
            if (keys.includes(userId)) {
              Object.entries(reports as Record<string, any>).forEach(([reportId, reportDetail]) => {
                filteredReports.push({ userId, reportId, ...(reportDetail as ReportData) });
              });
            }
          });
  
          setInvestigation(filteredReports);
        }
  
        // 5. Fetch dan filter visits berdasarkan keys
        const visitsData = await getFromDatabase("visit/");
        if (visitsData) {
          const filteredVisits: VisitData[] = [];
  
          Object.entries(visitsData).forEach(([userId, visits]) => {
            if (keys.includes(userId)) {
              Object.entries(visits as Record<string, any>).forEach(([visitId, visitDetail]) => {
                filteredVisits.push({ userId, visitId, ...(visitDetail as VisitData) });
              });
            }
          });
  
          setVisitReport(filteredVisits);
        }
  
        // 6. Fetch dan filter schedules berdasarkan keys
        const schedulesData = await getFromDatabase("schedule/");
        if (schedulesData) {
          const filteredSchedules: ScheduleData[] = [];
  
          Object.entries(schedulesData).forEach(([userId, schedules]) => {
            if (keys.includes(userId)) {
              Object.entries(schedules as Record<string, any>).forEach(([scheduleId, scheduleDetail]) => {
                filteredSchedules.push({ userId, scheduleId, ...(scheduleDetail as ScheduleData) });
              });
            }
          });
  
          setAllSchedules(filteredSchedules);
        }
  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user?.uid]);
  
  return (
    <div className="w-10/12 mx-auto flex flex-wrap justify-start pt-16 gap-10 bg-white">

      {/* Display Number of Report Investigasi */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Report Investigasi</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {investigation.length}
          <span className="text-sm font-light ml-2">doc</span>
        </p>
      </div>

      {/* Display Number of Report Visit */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Report Visit</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {visitReport.length}
          <span className="text-sm font-light ml-2">doc</span>
        </p>
      </div>

      {/* Display Number of Total Schedule */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Schedule</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {allSchedules.length}
          <span className="text-sm font-light ml-2">doc</span>
        </p>
      </div>

      {/* Display Number of Total Cabang */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Cabang</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {keyData.length}
          <span className="text-sm font-light ml-2">user</span>
        </p>
      </div>

    </div>
  );
};

export default Dealer;
