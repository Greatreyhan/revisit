import React, { useEffect, useState } from "react";
import { useFirebase } from "../../../utils/FirebaseContext";
import { ReportData } from "../../interface/Report";
import SelectInput from "../../molecules/SelectInput";
import InputField from "../../molecules/InputField";
import { areaData, areaMap, cargoTypesData, classificationMap, DealerData, euroTypeData, focusModelsData, karoseriCustomersData, problemCategoriesData, segmentData, seriesData, vehicleTypesData } from "../../../utils/masterData";
import { MdOutlineClose } from "react-icons/md";

const AdminVisualization: React.FC = () => {
  const { getFromDatabase } = useFirebase()

  // General Information
  const [largeClassification, setLargeClassification] = useState<string>("");
  const [dataMiddleClassification, setDataMiddleClassification] = useState<string[]>([])
  const [middleClassification, setMiddleClassification] = useState<string>("");

  // Vehicle Information
  const [area, setArea] = useState<string>("");
  const [dataLocation, setDataLocation] = useState<string[]>([])
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

  const [isShow, setIsShow] = useState<boolean>(false)

  useEffect(() => {

    getFromDatabase("report/").then((data) => {
      if (data) {
        console.log("Raw Data:", data);

        const reportsArray: ReportData[] = [];

        Object.entries(data).forEach(([userId, reports]) => {
          Object.entries(reports as Record<string, any>).forEach(([reportId, reportData]) => {
            reportsArray.push({ userId, reportId, ...(reportData as ReportData) });
          });
        });
      }
    });

  }, []);

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
  };

  return (
    <div className="w-10/12 mx-auto flex flex-wrap justify-start pt-16 gap-10 bg-white">
      <div className={`fixed ${isShow ? "flex" : "hidden"} justify-center items-center bg-black bg-opacity-80 w-screen h-screen top-0 left-0 overflow-y-auto`}>
        <form className="w-10/12 mt-32 relative">
          <button type="button" onClick={()=>setIsShow(false)} className="absolute top-4 right-0 bg-red-700 p-3 rounded-tr-lg"><MdOutlineClose className="text-3xl font-semibold text-white" /></button>
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
          </div>
        </form>
      </div>

    </div>
  );
};

export default AdminVisualization;