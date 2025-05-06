import React, { useEffect, useState } from "react";
import { Article } from "../../interface/Article";
import { Portofolio } from "../../interface/Portofolio";
import { Career } from "../../interface/Career";
import { useFirebase } from "../../../utils/FirebaseContext";
import { TraineeData } from "../../interface/Training";
import { HealthReportData } from "../../interface/Health";
import { CustomerData } from "../../interface/Customer";
import { MdBookmarks, MdHealthAndSafety, MdInsertPageBreak, MdLocationPin, MdSupervisedUserCircle } from "react-icons/md";
import { IoCalendarSharp } from "react-icons/io5";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const Profile: React.FC = () => {
  const { getFromDatabase, user } = useFirebase()
  const [report, setReport] = useState<string[]>([]);
  const [visit, setVisit] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);
  const [customer, setCustomer] = useState<string[]>([]);
  const [training, setTraining] = useState<string[]>([]);
  const [health, setHealth] = useState<string[]>([]);
  const [reportFiltered, setReportFiltered] = useState<string[]>([]);
  const [visitFiltered, setVisitFiltered] = useState<string[]>([]);
  const [scheduleFiltered, setScheduleFiltered] = useState<string[]>([]);
  const [customerFiltered, setCustomerFiltered] = useState<string[]>([]);
  const [trainingFiltered, setTrainingFiltered] = useState<string[]>([]);
  const [healthFiltered, setHealthFiltered] = useState<string[]>([]);

  function filterDate(timestamps: string[]): string[] {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    return timestamps.filter(ts => {
      const t = Number(ts);
      return t >= sevenDaysAgo;
    });
  }

  useEffect(() => {
    // Fetch articles
    getFromDatabase("report/" + user?.uid).then(data => {
      const dataConverted: Article | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setReport(keys);
        setReportFiltered(filterDate(keys));
      }
    });

    // Fetch portfolios
    getFromDatabase("visit/" + user?.uid).then(data => {
      const dataConverted: Portofolio | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setVisit(keys);
        setVisitFiltered(filterDate(keys));
      }
    });

    // Fetch career
    getFromDatabase("schedule/" + user?.uid).then(data => {
      const dataConverted: Career | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setSchedule(keys);
        setScheduleFiltered(filterDate(keys));
      }
    });

    // Fetch customer
    getFromDatabase("customer/" + user?.uid).then(data => {
      const dataConverted: CustomerData | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setCustomer(keys);
        setCustomerFiltered(filterDate(keys));
      }
    });

    // Fetch training
    getFromDatabase("training/" + user?.uid).then(data => {
      const dataConverted: TraineeData | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setTraining(keys);
        setTrainingFiltered(filterDate(keys));
      }
    });

    // Fetch health
    getFromDatabase("health/" + user?.uid).then(data => {
      const dataConverted: HealthReportData | null = data;
      if (dataConverted) {
        const keys = Object.keys(dataConverted);
        setHealth(keys);
        setHealthFiltered(filterDate(keys));
      }
    });
  }, [user?.uid]);

  return (
    <div className="w-10/12 mx-auto flex flex-wrap justify-start pt-16 gap-10 bg-white">
      {/* Display Number of Articles */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-base font-semibold text-slate-800 flex items-center">
          <MdInsertPageBreak className='text-xl mr-1' />
          Total Report</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {report.length}
          <span className="text-sm font-light ml-2">report</span>
        </p>
        {reportFiltered.length > 0 ?
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-green-800 text-green-800"><FaArrowTrendUp /></span>
            <span className="ml-2 font-semibold text-lg text-green-800">+{reportFiltered.length}</span>
          </div>
          :
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-red-800 text-red-800"><FaArrowTrendDown /></span>
            <span className="ml-2 font-semibold text-lg text-red-800">{reportFiltered.length}</span>
          </div>
        }

      </div>

      {/* Display Number of Portfolios */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-base font-semibold text-slate-800 flex items-center">
          <MdLocationPin className='text-xl mr-1' />
          Total Visit</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {visit.length}
          <span className="text-sm font-light ml-2">visit</span>
        </p>
        {visitFiltered.length > 0 ?
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-green-800 text-green-800"><FaArrowTrendUp /></span>
            <span className="ml-2 font-semibold text-lg text-green-800">+{visitFiltered.length}</span>
          </div>
          :
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-red-800 text-red-800"><FaArrowTrendDown /></span>
            <span className="ml-2 font-semibold text-lg text-red-800">{visitFiltered.length}</span>
          </div>
        }
      </div>

      {/* Display Number of Career */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-base font-semibold text-slate-800 flex items-center">
          <IoCalendarSharp className='text-xl mr-1' />
          Total Schedule</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {schedule.length}
          <span className="text-sm font-light ml-2">schedule</span>
        </p>
        {scheduleFiltered.length > 0 ?
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-green-800 text-green-800"><FaArrowTrendUp /></span>
            <span className="ml-2 font-semibold text-lg text-green-800">+{scheduleFiltered.length}</span>
          </div>
          :
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-red-800 text-red-800"><FaArrowTrendDown /></span>
            <span className="ml-2 font-semibold text-lg text-red-800">{scheduleFiltered.length}</span>
          </div>
        }
      </div>

      {/* Display Number of Career */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-base font-semibold text-slate-800 flex items-center"><MdSupervisedUserCircle className='text-xl mr-1' />
          Total Customer</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {customer.length}
          <span className="text-sm font-light ml-2">person</span>
        </p>
        {customerFiltered.length > 0 ?
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-green-800 text-green-800"><FaArrowTrendUp /></span>
            <span className="ml-2 font-semibold text-lg text-green-800">+{customerFiltered.length}</span>
          </div>
          :
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-red-800 text-red-800"><FaArrowTrendDown /></span>
            <span className="ml-2 font-semibold text-lg text-red-800">{customerFiltered.length}</span>
          </div>
        }
      </div>

      {/* Display Number of Career */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-base font-semibold text-slate-800 flex items-center"><MdHealthAndSafety className='text-xl mr-1' />
          Total Health Report</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {health.length}
          <span className="text-sm font-light ml-2">doc</span>
        </p>
        {healthFiltered.length > 0 ?
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-green-800 text-green-800"><FaArrowTrendUp /></span>
            <span className="ml-2 font-semibold text-lg text-green-800">+{healthFiltered.length}</span>
          </div>
          :
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-red-800 text-red-800"><FaArrowTrendDown /></span>
            <span className="ml-2 font-semibold text-lg text-red-800">{healthFiltered.length}</span>
          </div>
        }
      </div>

      {/* Display Number of Career */}
      <div className="w-72 bg-slate-100 px-8 py-4 rounded-md">
        <h2 className="text-base font-semibold text-slate-800 flex items-center"><MdBookmarks className='text-xl mr-1' />Total Training Report</h2>
        <p className="text-4xl text-primary flex justify-end items-end mt-4 font-bold">
          {training.length}
          <span className="text-sm font-light ml-2">doc</span>
        </p>
        {trainingFiltered.length > 0 ?
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-green-800 text-green-800"><FaArrowTrendUp /></span>
            <span className="ml-2 font-semibold text-lg text-green-800">+{trainingFiltered.length}</span>
          </div>
          :
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full flex items-center justify-center border border-red-800 text-red-800"><FaArrowTrendDown /></span>
            <span className="ml-2 font-semibold text-lg text-red-800">{trainingFiltered.length}</span>
          </div>
        }
      </div>
    </div>
  );
};

export default Profile;
