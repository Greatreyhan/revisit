import React, { useEffect, useState } from "react";
import { Article } from "../../interface/Article";
import { useFirebase } from "../../../utils/FirebaseContext";
import { ReportData } from "../../interface/Report";
import { VisitData } from "../../interface/Visit";
import { ScheduleData } from "../../interface/Schedule";
import { HealthReportData } from "../../interface/Health";
import { TraineeData } from "../../interface/Training";
import { CustomerData } from "../../interface/Customer";



const Admin: React.FC = () => {
  const { getFromDatabase } = useFirebase()
  const [keyArticle, setKeyArticle] = useState<string[]>([]);
  const [keyData, setKeyData] = useState<string[]>([]);
  const [investigation, setInvestigation] = useState<ReportData[]>([]);
  const [visitReport, setVisitReport] = useState<VisitData[]>([]);
  const [allSchedules, setAllSchedules] = useState<ScheduleData[]>([]);
  const [allTrainee, setAllTrainee] = useState<TraineeData[]>([]);
  const [allHealth, setAllHealth] = useState<HealthReportData[]>([]);
  const [allCustomer, setAllCustomer] = useState<CustomerData[]>([]);

  useEffect(() => {

    // Fetch articles
    getFromDatabase("article").then(data => {
      const dataConverted: Article | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setKeyArticle(keys);
      }
    });

    // Fetch portfolios
    getFromDatabase("user").then(data => {
      if (data) {
        const keys = Object.keys(data);
        setKeyData(keys);
      }
    });

    getFromDatabase("report/").then((data) => {
      if (data) {
        console.log("Raw Data:", data);

        const reportsArray: ReportData[] = [];

        Object.entries(data).forEach(([userId, reports]) => {
          Object.entries(reports as Record<string, any>).forEach(([reportId, reportData]) => {
            reportsArray.push({ userId, reportId, ...(reportData as ReportData) });
          });
        });
        setInvestigation(reportsArray);
      }
    });

    getFromDatabase("visit/").then((data) => {
      if (data) {
        console.log("Raw Data:", data);

        const reportsArray: VisitData[] = [];

        Object.entries(data).forEach(([userId, reports]) => {
          Object.entries(reports as Record<string, any>).forEach(([reportId, reportData]) => {
            reportsArray.push({ userId, reportId, ...(reportData as VisitData) });
          });
        });
        setVisitReport(reportsArray);
      }
    });

    getFromDatabase("schedule/").then((data) => {
      if (data) {
        console.log("Raw Data:", data);

        const scheduleArray: ScheduleData[] = [];

        Object.entries(data).forEach(([userId, schedules]) => {
          Object.entries(schedules as Record<string, any>).forEach(([scheduleId, scheduleData]) => {
            scheduleArray.push({ userId, scheduleId, ...(scheduleData as ScheduleData) });
          });
        });
        setAllSchedules(scheduleArray);
      }
    });

    // Fetch dan filter Schedule
    getFromDatabase("schedule/").then((data) => {
      if (data) {
        console.log("Raw Schedule Data:", data);
        const scheduleArray: ScheduleData[] = [];
        Object.entries(data).forEach(([userId, schedules]) => {
          Object.entries(schedules as Record<string, any>).forEach(([scheduleId, scheduleData]) => {
            scheduleArray.push({ userId, scheduleId, ...(scheduleData as ScheduleData) });
          });
        });
        setAllSchedules(scheduleArray);
      }
    });

    // Fetch dan filter Health
    getFromDatabase("health/").then((data) => {
      if (data) {
        console.log("Raw Health Data:", data);
        const healthArray: HealthReportData[] = [];
        Object.entries(data).forEach(([userId, healthEntries]) => {
          Object.entries(healthEntries as Record<string, any>).forEach(([healthId, healthData]) => {
            healthArray.push({ userId, healthId, ...(healthData as HealthReportData) });
          });
        });
        setAllHealth(healthArray);
      }
    });

    // Fetch dan filter Training
    getFromDatabase("training/").then((data) => {
      if (data) {
        console.log("Raw Training Data:", data);
        const trainingArray: TraineeData[] = [];
        Object.entries(data).forEach(([userId, trainingEntries]) => {
          Object.entries(trainingEntries as Record<string, any>).forEach(([traineeId, trainingData]) => {
            trainingArray.push({ userId, traineeId, ...(trainingData as TraineeData) });
          });
        });
        setAllTrainee(trainingArray);
      }
    });

    // Fetch dan filter Customer
    getFromDatabase("customer/").then((data) => {
      if (data) {
        console.log("Raw Customer Data:", data);
        const customerArray: CustomerData[] = [];
        Object.entries(data).forEach(([userId, customerEntries]) => {
          Object.entries(customerEntries as Record<string, any>).forEach(([customerId, customerData]) => {
            customerArray.push({ userId, customerId, ...(customerData as CustomerData) });
          });
        });
        setAllCustomer(customerArray);
      }
    });


  }, []);

  return (
    <div className="w-10/12 mx-auto flex flex-wrap justify-start pt-16 gap-10 bg-white">
      {/* Display Number of Articles */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Report Investigasi</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {investigation.length}
          <span className="text-sm font-light ml-2">doc</span>
        </p>
      </div>

      {/* Display Number of Articles */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Report Visit</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {visitReport.length}
          <span className="text-sm font-light ml-2">doc</span>
        </p>
      </div>

      {/* Display Number of Articles */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Schedule</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {allSchedules.length}
          <span className="text-sm font-light ml-2">doc</span>
        </p>
      </div>

      {/* Display Number of Articles */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Artikel</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {keyArticle.length}
          <span className="text-sm font-light ml-2">artikel</span>
        </p>
      </div>

      {/* Display Number of Portfolios */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total User</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {keyData.length}
          <span className="text-sm font-light ml-2">user</span>
        </p>
      </div>

      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Health Report</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {allHealth.length}
          <span className="text-sm font-light ml-2">laporan</span>
        </p>
      </div>

      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Training Report</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {allTrainee.length}
          <span className="text-sm font-light ml-2">laporan</span>
        </p>
      </div>

      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Customer</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {allCustomer.length}
          <span className="text-sm font-light ml-2">data</span>
        </p>
      </div>

    </div>
  );
};

export default Admin;
