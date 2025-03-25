import React, { useEffect, useState } from "react";
import { useFirebase } from "../../utils/FirebaseContext";
import { ReportData } from "../interface/Report";
import SelectInput from "../molecules/SelectInput";
import InputField from "../molecules/InputField";
import { areaData, areaMap, cargoTypesData, classificationMap, DealerData, euroTypeData, focusModelsData, karoseriCustomersData, problemCategoriesData, segmentData, seriesData, vehicleTypesData } from "../../utils/masterData";
import { MdFilterAlt, MdOutlineClose } from "react-icons/md";
import { BiSave } from "react-icons/bi";
import SegmentChart from "../organisms/SegmentChart";
import ProblemToMileageChart from "../organisms/ProblemToMileageChart";
import SeriesChart from "../organisms/SeriesChart";
import AreaChartReport from "../organisms/AreaChart";
import TimeSeriesCasesChart from "../organisms/TimeSeriesCasesChart";
import PieClassification from "../organisms/PieClassification";


const DealerVisualizationInvestigation: React.FC = () => {
  const { getFromDatabase, user } = useFirebase();
  const [investigationReport, setInvestigationReport] = useState<ReportData[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportData[]>([]);

  // Data
  const [dataMiddleClassification, setDataMiddleClassification] = useState<string[]>([])
  const [dataLocation, setDataLocation] = useState<string[]>([])

  // Filters
  const [largeClassification, setLargeClassification] = useState<string>("");
  const [middleClassification, setMiddleClassification] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [dealer, setDealer] = useState<string>("");
  const [series, setSeries] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [focusModel, setFocusModel] = useState<string>("");
  const [euroType, setEuroType] = useState<string>("");
  const [VIN, setVIN] = useState<string>("");
  const [karoseri, setKaroseri] = useState<string>("");
  const [segment, setSegment] = useState<string>("");
  const [application, setApplication] = useState<string>("");
  const [problemDateStart, setProblemDateStart] = useState<string>("");
  const [problemDateEnd, setProblemDateEnd] = useState<string>("");
  const [visitDateStart, setVisitDateStart] = useState<string>("");
  const [visitDateEnd, setVisitDateEnd] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
  
      try {
        // Ambil daftar cabang yang terkait dengan user
        const cabangData = await getFromDatabase(`cabang/${user.uid}`);
        const keys = cabangData ? Object.keys(cabangData) : [];
    
        // Ambil semua data schedule
        const reportData = await getFromDatabase("report/");
        if (!reportData) return;
    
        const reportArray: ReportData[] = [];
  
        Object.entries(reportData).forEach(([userId, schedules]) => {
          // Hanya proses jika userId ada di keys
          if (keys.includes(userId)) {
            Object.entries(schedules as Record<string, any>).forEach(([reportId, reportDetail]) => {
              reportArray.push({ userId, reportId, ...(reportDetail as ReportData) });
            });
          }
        });
  
        setInvestigationReport(reportArray);
        setFilteredReports(reportArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [user?.uid]);

  // Function to apply filters
  useEffect(() => {
    const filterReports = () => {

      const filtered = investigationReport.filter((report) => {
        return (
          (!largeClassification || report.largeClassification === largeClassification) &&
          (!middleClassification || report.middleClassification === middleClassification) &&
          (!area || report.area === area) &&
          (!location || report.location === location) &&
          (!dealer || report.dealer === dealer) &&
          (!series || report.series === series) &&
          (!vehicleType || report.vehicleType === vehicleType) &&
          (!focusModel || report.focusModel === focusModel) &&
          (!euroType || report.euroType === euroType) &&
          (!VIN || report.VIN.toLowerCase().includes(VIN.toLowerCase())) &&
          (!karoseri || report.karoseri === karoseri) &&
          (!segment || report.segment === segment) &&
          (!application || report.application === application) &&
          (!status || report.status === status) &&
          (!problemDateStart || (report.problemDate && report.problemDate >= problemDateStart)) &&
          (!problemDateEnd || (report.problemDate && report.problemDate <= problemDateEnd)) &&
          (!visitDateStart || (report.visitDate && report.visitDate >= visitDateStart)) &&
          (!visitDateEnd || (report.visitDate && report.visitDate <= visitDateEnd))
        );
      });

      console.log(filtered)
      setFilteredReports(filtered);
    };

    if (isDataChanged) {
      filterReports();
      setIsDataChanged(false);
    }
  }, [
    investigationReport,
    largeClassification,
    middleClassification,
    area,
    location,
    dealer,
    series,
    vehicleType,
    focusModel,
    euroType,
    VIN,
    karoseri,
    segment,
    application,
    problemDateStart,
    problemDateEnd,
    visitDateStart,
    visitDateEnd,
    status,
    isDataChanged,
  ]);

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
  };

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
            <div className="md:flex w-full gap-5">
              <SelectInput required={true} label="Large Classification" name="Large Classification" value={largeClassification} onChange={(e) => { setLargeClassification(e.target.value); setDataMiddleClassification(classificationMap[e.target.value] || []); }} options={problemCategoriesData} />
              <SelectInput required={true} label="Middle Classification" name="Middle Classification" value={middleClassification} onChange={handleChange(setMiddleClassification)} options={dataMiddleClassification} />
            </div>
            <div className="md:flex w-full gap-5">
              <SelectInput required={true} label="Dealer" name="dealer" value={dealer} onChange={handleChange(setDealer)} options={DealerData} />
              <SelectInput required={true} label="Area" name="area" value={area} onChange={(e) => { setArea(e.target.value); setDataLocation(areaMap[e.target.value] || []); }} options={areaData} />
              <SelectInput required={true} label="Lokasi" name="location" value={location} onChange={handleChange(setLocation)} options={dataLocation} />
            </div>
            <div className="md:flex w-full gap-5">
              <SelectInput required={true} label="Seri Kendaraan" name="series" value={series} onChange={handleChange(setSeries)} options={seriesData} />
              <SelectInput required={true} label="Tipe Kendaraan" name="vehicleType" value={vehicleType} onChange={handleChange(setVehicleType)} options={vehicleTypesData} />
              <SelectInput required={true} label="Model Fokus" name="focusModel" value={focusModel} onChange={handleChange(setFocusModel)} options={focusModelsData} />
            </div>
            <div className="md:flex w-full gap-5">
              <SelectInput label="Segmen" name="segment" value={segment} onChange={handleChange(setSegment)} options={segmentData} />
              <SelectInput label="Aplikasi" name="application" value={application} onChange={handleChange(setApplication)} options={cargoTypesData} />
              <SelectInput label="Karoseri" name="karoseri" value={karoseri} onChange={handleChange(setKaroseri)} options={karoseriCustomersData} />
            </div>
            <div className="md:flex w-full gap-5">
              <SelectInput required={true} label="Tipe Euro" name="euroType" value={euroType} onChange={handleChange(setEuroType)} options={euroTypeData} />
              <InputField required={true} label="VIN" name="VIN" value={VIN} onChange={handleChange(setVIN)} placeholder="Masukkan VIN" />
              <SelectInput required={true} label="Status" name="status" value={status} onChange={handleChange(setStatus)} options={["Breakdown", "Operational"]} />
            </div>
            <div className="md:flex w-full gap-5">
              <InputField label="Tanggal Masalah" name="problemDateStart" type="date" value={problemDateStart} onChange={handleChange(setProblemDateStart)} />
              <InputField label="Tanggal Masalah" name="problemDateEnd" type="date" value={problemDateEnd} onChange={handleChange(setProblemDateEnd)} />
            </div>
            <div className="md:flex w-full gap-5">
              <InputField label="Tanggal Kunjungan" name="visitDateStart" type="date" value={visitDateStart} onChange={handleChange(setVisitDateStart)} />
              <InputField label="Tanggal Kunjungan" name="visitDateEnd" type="date" value={visitDateEnd} onChange={handleChange(setVisitDateEnd)} />
            </div>
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

      {/* Menampilkan Grafik Balok berdasarkan Large Classification */}
      <TimeSeriesCasesChart reports={filteredReports} />
      <div className="flex w-full gap-x-5 justify-between">
        <PieClassification reports={filteredReports} />
        <AreaChartReport reports={filteredReports} />
      </div>
      <div className="flex gap-x-5 w-full justify-around">
        <SeriesChart reports={filteredReports} />
        <SegmentChart reports={filteredReports} />
      </div>
      <ProblemToMileageChart reports={filteredReports} />

    </div>
  );
};

export default DealerVisualizationInvestigation;
