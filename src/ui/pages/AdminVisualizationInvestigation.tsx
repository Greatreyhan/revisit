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


const AdminVisualizationInvestigation: React.FC = () => {
  const { getFromDatabase } = useFirebase();
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
    getFromDatabase("report/").then((data) => {
      if (data) {
        const reportsArray: ReportData[] = [];
        Object.entries(data).forEach(([userId, reports]) => {
          Object.entries(reports as Record<string, any>).forEach(([reportId, reportData]) => {
            reportsArray.push({ userId, reportId, ...(reportData as ReportData) });
          });
        });
        setInvestigationReport(reportsArray);
        setFilteredReports(reportsArray);
      }
    });
  }, []);

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
    <div className="md:w-10/12 w-11/12 mx-auto flex flex-wrap justify-start pt-16 gap-10 bg-white">
      <div className="w-full flex justify-end mt-4">
        <button
          type="button"
          onClick={() => setIsShow(true)}
          className="mt-4 px-6 py-3 inline-flex justify-center items-center bg-primary rounded-full text-white"
        >
          <span className="mr-1">Filter Data</span> <MdFilterAlt className="text-2xl" />
        </button>
      </div>

      <div
        className={`fixed ${isShow ? "flex" : "hidden"} z-50 justify-center items-center bg-black bg-opacity-80 w-screen top-0 left-0`}
      >
        <form className="relative md:w-10/12 w-11/12 h-screen overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 bg-white rounded-lg p-6">
          <button
            type="button"
            onClick={() => setIsShow(false)}
            className="absolute top-4 right-4 bg-red-700 hover:bg-red-800 transition-colors p-2 rounded-full"
          >
            <MdOutlineClose className="text-xl text-white" />
          </button>
          <h2 className="text-2xl font-semibold mb-6">Filter</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
                required
                label="Large Classification"
                name="Large Classification"
                value={largeClassification}
                onChange={(e) => {
                  setLargeClassification(e.target.value);
                  setDataMiddleClassification(classificationMap[e.target.value] || []);
                }}
                options={problemCategoriesData}
              />
              <SelectInput
                required
                label="Middle Classification"
                name="Middle Classification"
                value={middleClassification}
                onChange={handleChange(setMiddleClassification)}
                options={dataMiddleClassification}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectInput
                required
                label="Dealer"
                name="dealer"
                value={dealer}
                onChange={handleChange(setDealer)}
                options={DealerData}
              />
              <SelectInput
                required
                label="Area"
                name="area"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setDataLocation(areaMap[e.target.value] || []);
                }}
                options={areaData}
              />
              <SelectInput
                required
                label="Lokasi"
                name="location"
                value={location}
                onChange={handleChange(setLocation)}
                options={dataLocation}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectInput
                required
                label="Seri Kendaraan"
                name="series"
                value={series}
                onChange={handleChange(setSeries)}
                options={seriesData}
              />
              <SelectInput
                required
                label="Tipe Kendaraan"
                name="vehicleType"
                value={vehicleType}
                onChange={handleChange(setVehicleType)}
                options={vehicleTypesData}
              />
              <SelectInput
                required
                label="Model Fokus"
                name="focusModel"
                value={focusModel}
                onChange={handleChange(setFocusModel)}
                options={focusModelsData}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectInput
                label="Segmen"
                name="segment"
                value={segment}
                onChange={handleChange(setSegment)}
                options={segmentData}
              />
              <SelectInput
                label="Aplikasi"
                name="application"
                value={application}
                onChange={handleChange(setApplication)}
                options={cargoTypesData}
              />
              <SelectInput
                label="Karoseri"
                name="karoseri"
                value={karoseri}
                onChange={handleChange(setKaroseri)}
                options={karoseriCustomersData}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectInput
                required
                label="Tipe Euro"
                name="euroType"
                value={euroType}
                onChange={handleChange(setEuroType)}
                options={euroTypeData}
              />
              <InputField
                required
                label="VIN"
                name="VIN"
                value={VIN}
                onChange={handleChange(setVIN)}
                placeholder="Masukkan VIN"
              />
              <SelectInput
                required
                label="Status"
                name="status"
                value={status}
                onChange={handleChange(setStatus)}
                options={["Breakdown", "Operational"]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Tanggal Masalah"
                name="problemDateStart"
                type="date"
                value={problemDateStart}
                onChange={handleChange(setProblemDateStart)}
              />
              <InputField
                label="Tanggal Masalah"
                name="problemDateEnd"
                type="date"
                value={problemDateEnd}
                onChange={handleChange(setProblemDateEnd)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Tanggal Kunjungan"
                name="visitDateStart"
                type="date"
                value={visitDateStart}
                onChange={handleChange(setVisitDateStart)}
              />
              <InputField
                label="Tanggal Kunjungan"
                name="visitDateEnd"
                type="date"
                value={visitDateEnd}
                onChange={handleChange(setVisitDateEnd)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={() => {
                setIsDataChanged(true);
                setIsShow(false);
              }}
              className="px-6 py-3 bg-primary hover:bg-primary-dark transition-colors rounded-full text-white flex items-center"
            >
              <span className="mr-2">Filter</span>
              <BiSave className="text-xl" />
            </button>
          </div>
        </form>
      </div>


      {/* Menampilkan Grafik Balok berdasarkan Large Classification */}
      <TimeSeriesCasesChart reports={filteredReports} />
      <div className="flex flex-wrap md:flex-nowrap w-full gap-x-5 justify-between">
        <PieClassification reports={filteredReports} />
        <AreaChartReport reports={filteredReports} />
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-x-5 w-full justify-around">
        <SeriesChart reports={filteredReports} />
        <SegmentChart reports={filteredReports} />
      </div>
      <ProblemToMileageChart reports={filteredReports} />

    </div>
  );
};

export default AdminVisualizationInvestigation;
