import React, { useEffect, useState } from "react";
import { Article } from "../interface/Article";
import { Portofolio } from "../interface/Portofolio";
import { Career } from "../interface/Career";
import { Service } from "../interface/Service";
import { Client } from "../interface/Client";
import { useFirebase } from "../../utils/FirebaseContext";

const Profile: React.FC = () => {
  const {getFromDatabase} = useFirebase()
  const [report, setReport] = useState<string[]>([]);
  const [visit, setVisit] = useState<string[]>([]);
  const [keyCareer, setKeyCareer] = useState<string[]>([]);
  const [keyClient, setKeyClient] = useState<string[]>([]);
  const [keyService, setKeyService] = useState<string[]>([]);

  useEffect(() => {
    // Fetch articles
    getFromDatabase("report").then(data => {
      const dataConverted: Article | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setReport(keys);
      }
    });

    // Fetch portfolios
    getFromDatabase("visit").then(data => {
      const dataConverted: Portofolio | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setVisit(keys);
      }
    });

    // Fetch career
    getFromDatabase("career").then(data => {
      const dataConverted: Career | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setKeyCareer(keys);
      }
    });

    // Fetch service
    getFromDatabase("service").then(data => {
      const dataConverted: Service | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setKeyService(keys);
      }
    });

    // Fetch client
    getFromDatabase("client").then(data => {
      const dataConverted: Client | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setKeyClient(keys);
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
        <h2 className="text-lg text-slate-900">Total Warranty</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {keyCareer.length}
          <span className="text-sm font-light ml-2">claim</span>
        </p>
      </div>

      {/* Display Number of Career */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Visit</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {keyService.length}
          <span className="text-sm font-light ml-2">visit</span>
        </p>
      </div>

      {/* Display Number of Career */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-lg text-slate-900">Total Customer</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {keyClient.length}
          <span className="text-sm font-light ml-2">customer</span>
        </p>
      </div>
    </div>
  );
};

export default Profile;
