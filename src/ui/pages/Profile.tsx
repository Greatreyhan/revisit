import React, { useEffect, useState } from "react";
import { Article } from "../interface/Article";
import { Portofolio } from "../interface/Portofolio";
import { Career } from "../interface/Career";
import { useFirebase } from "../../utils/FirebaseContext";
import { TraineeData } from "../interface/Training";
import { HealthReportData } from "../interface/Health";
import { CustomerData } from "../interface/Customer";

const Profile: React.FC = () => {
  const {getFromDatabase, user} = useFirebase()
  const [report, setReport] = useState<string[]>([]);
  const [visit, setVisit] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);
  const [customer, setCustomer] = useState<string[]>([]);
  const [training, setTraining] = useState<string[]>([]);
  const [health, setHealth] = useState<string[]>([]);

  useEffect(() => {
    // Fetch articles
    getFromDatabase("report/"+user?.uid).then(data => {
      const dataConverted: Article | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setReport(keys);
      }
    });

    // Fetch portfolios
    getFromDatabase("visit/"+user?.uid).then(data => {
      const dataConverted: Portofolio | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setVisit(keys);
      }
    });

    // Fetch career
    getFromDatabase("schedule/"+user?.uid).then(data => {
      const dataConverted: Career | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setSchedule(keys);
      }
    });

    getFromDatabase("customer/"+user?.uid).then(data => {
      const dataConverted: CustomerData | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setCustomer(keys);
      }
    });

    getFromDatabase("training/"+user?.uid).then(data => {
      const dataConverted: TraineeData | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setTraining(keys);
      }
    });

    getFromDatabase("health/"+user?.uid).then(data => {
      const dataConverted: HealthReportData | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setHealth(keys);
      }
    });
  }, []);

  return (
    <div className="w-10/12 mx-auto flex flex-wrap justify-start pt-16 gap-10 bg-white">
      {/* Display Number of Articles */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Report</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {report.length}
          <span className="text-sm font-light ml-2">report</span>
        </p>
      </div>

      {/* Display Number of Portfolios */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Visit</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {visit.length}
          <span className="text-sm font-light ml-2">visit</span>
        </p>
      </div>

      {/* Display Number of Career */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Schedule</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {schedule.length}
          <span className="text-sm font-light ml-2">schedule</span>
        </p>
      </div>

      {/* Display Number of Career */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Customer</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {customer.length}
          <span className="text-sm font-light ml-2">person</span>
        </p>
      </div>

      {/* Display Number of Career */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Health Report</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {health.length}
          <span className="text-sm font-light ml-2">doc</span>
        </p>
      </div>

      {/* Display Number of Career */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Training Report</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {training.length}
          <span className="text-sm font-light ml-2">doc</span>
        </p>
      </div>
    </div>
  );
};

export default Profile;
