import React, { useEffect, useState } from "react";
import { Article } from "../interface/Article";
import { Portofolio } from "../interface/Portofolio";
import { Career } from "../interface/Career";
import { useFirebase } from "../../utils/FirebaseContext";

const Profile: React.FC = () => {
  const {getFromDatabase, user} = useFirebase()
  const [report, setReport] = useState<string[]>([]);
  const [visit, setVisit] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);

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

    // // Fetch service
    // getFromDatabase("service/"+user?.uid).then(data => {
    //   const dataConverted: Service | null = data;
    //   if (dataConverted) {
    //     const keys = Object.keys(dataConverted);
    //     setKeyService(keys);
    //   }
    // });

    // // Fetch client
    // getFromDatabase("client/"+user?.uid).then(data => {
    //   const dataConverted: Client | null = data;
    //   if (dataConverted) {
    //     const keys = Object.keys(dataConverted);
    //     setKeyClient(keys);
    //   }
    // });
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
      {/* <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Client</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {keyService.length}
          <span className="text-sm font-light ml-2">person</span>
        </p>
      </div> */}

      {/* Display Number of Career */}
      {/* <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Unit</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {keyClient.length}
          <span className="text-sm font-light ml-2">unit</span>
        </p>
      </div> */}
    </div>
  );
};

export default Profile;
