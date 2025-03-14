import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../utils/FirebaseContext";
import { IoMdDownload, IoMdSearch } from "react-icons/io";
import SelectInput from "../molecules/SelectInput";
import InputField from "../molecules/InputField";
import AddUnit from "../organisms/AddUnit";
import AddUnitInvolve from "../organisms/AddUnitInvolve";
import AddContentInvestigation from "../organisms/AddContentInvestigation";
import AddAttachment from "../organisms/AddAttachment";
import TextField from "../molecules/TextField";
import { areaData, areaMap, cargoTypesData, classificationMap, DealerData, euroTypeData, focusModelsData, karoseriCustomersData, problemCategoriesData, segmentData, seriesData, vehicleTypesData } from "../../utils/masterData";
import { AttachmentItem, InvestigationItem, Unit, UnitInvolve } from "../interface/Report";


const ProfileReportEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase, loading } = useFirebase()
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Context
    const [context, setContext] = useState<string>("");

    // General Information
    const [largeClassification, setLargeClassification] = useState<string>("");
    const [dataMiddleClassification, setDataMiddleClassification] = useState<string[]>([])
    const [middleClassification, setMiddleClassification] = useState<string>("");
    const [partProblem, setPartProblem] = useState<string>("");
    const [visitor, setVisitor] = useState<string>("");
    const [reviewer, setReviewer] = useState<string>("");
    const [approval, setApproval] = useState<string>("");

    // Vehicle Information
    const [customerName, setCustomerName] = useState<string>("");
    const [area, setArea] = useState<string>("");
    const [dataLocation, setDataLocation] = useState<string[]>([])
    const [location, setLocation] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [dealer, setDealer] = useState<string>("");
    const [series, setSeries] = useState<string>("");
    const [vehicleType, setVehicleType] = useState<string>("");
    const [focusModel, setFocusModel] = useState<string>("");
    const [euroType, setEuroType] = useState<string>("");
    const [VIN, setVIN] = useState<string>("");
    const [EGN, setEGN] = useState<string>("");
    const [productionDate, setProductionDate] = useState<string>("");
    const [payload, setPayload] = useState<string>("");
    const [mileage, setMileage] = useState<string>("");
    const [karoseri, setKaroseri] = useState<string>("");
    const [segment, setSegment] = useState<string>("");
    const [application, setApplication] = useState<string>("");
    const [loadingUnit, setLoadingUnit] = useState<string>("");
    const [problemDate, setProblemDate] = useState<string>("");
    const [visitDate, setVisitDate] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    // const [dateDifference, setDateDifference] = useState<string>("");

    // Road Condition
    const [highway, setHighway] = useState<string>("");
    const [cityRoad, setCityRoad] = useState<string>("");
    const [countryRoad, setCountryRoad] = useState<string>("");
    const [onRoad, setOnRoad] = useState<string>("");
    const [offRoad, setOffRoad] = useState<string>("");
    const [flatRoad, setFlatRoad] = useState<string>("");
    const [climbRoad, setClimbRoad] = useState<string>("");

    // Problem Background
    const [phenomenon, setPhenomenon] = useState<string>("");
    const [historyMaintenance, setHistoryMaintenance] = useState<string>("");
    const [FATemporaryInvestigation, setFATemporaryInvestigation] = useState<string>("");


    // Result
    const [investigationResult, setInvestigationResult] = useState<string>("");
    const [customerVoice, setCustomerVoice] = useState<string>("");
    const [temporaryAction, setTemporaryAction] = useState<string>("");
    const [homework, setHomework] = useState<string>("");
    const [otherCaseTIR, setOtherCaseTIR] = useState<string>("");
    const [difficultPoint, setDifficultPoint] = useState<string>("");

    const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
    const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [unitInvolves, setUnitInvolves] = useState<UnitInvolve[]>([])


    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi minimal, bisa dikembangkan lebih lanjut
        if (!context || !customerName || !location || !phenomenon) {
            console.log("Beberapa data penting masih kosong!");
            return;
        }

        const newData = {
            attachments,
            investigations,
            units,
            unitInvolves,

            // Context
            context,

            // General Information
            largeClassification,
            middleClassification,
            partProblem,
            visitor,
            reviewer,
            approval,

            // Vehicle Information
            customerName,
            area,
            location,
            city,
            dealer,
            series,
            vehicleType,
            focusModel,
            euroType,
            VIN,
            EGN,
            productionDate,
            payload,
            mileage,
            karoseri,
            segment,
            application,
            loadingUnit,
            problemDate,
            visitDate,
            status,

            // Road Condition
            highway,
            cityRoad,
            countryRoad,
            onRoad,
            offRoad,
            flatRoad,
            climbRoad,

            // Problem Background
            phenomenon,
            historyMaintenance,
            FATemporaryInvestigation,

            // Result
            investigationResult,
            customerVoice,
            temporaryAction,
            homework,
            otherCaseTIR,
            difficultPoint,
        };

        try {
            console.log(newData)
            await saveToDatabase(`report/${id || Date.now()}`, newData);
            navigate("/report"); // Navigasi ke halaman setelah submit
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    useEffect(() => {
        if (id) {
            getFromDatabase(`report/${id}`).then((data) => {
                if (data) {
                    // Array data
                    setAttachments(data.attachments);
                    setInvestigations(data.investigations)
                    setUnits(data.units)
                    setUnitInvolves(data.unitInvolves)

                    // Context
                    setContext(data.context || "");

                    // General Information
                    setLargeClassification(data.largeClassification || "");
                    setMiddleClassification(data.middleClassification || "");
                    setDataMiddleClassification([data.middleClassification || ""])
                    setPartProblem(data.partProblem || "");
                    setVisitor(data.visitor || "");
                    setReviewer(data.reviewer || "");
                    setApproval(data.approval || "");

                    // Vehicle Information
                    setCustomerName(data.customerName || "");
                    setArea(data.area || "");
                    setLocation(data.location || "");
                    setDataLocation([data.location || ""])
                    setCity(data.city || "");
                    setDealer(data.dealer || "");
                    setSeries(data.series || "");
                    setVehicleType(data.vehicleType || "");
                    setFocusModel(data.focusModel || "");
                    setEuroType(data.euroType || "");
                    setVIN(data.VIN || "");
                    setEGN(data.EGN || "");
                    setProductionDate(data.productionDate || "");
                    setPayload(data.payload || "");
                    setMileage(data.mileage || "");
                    setKaroseri(data.karoseri || "");
                    setSegment(data.segment || "");
                    setApplication(data.application || "");
                    setLoadingUnit(data.loadingUnit || "");
                    setProblemDate(data.problemDate || "");
                    setVisitDate(data.visitDate || "");
                    setStatus(data.status || "");

                    // Road Condition
                    setHighway(data.highway || "");
                    setCityRoad(data.cityRoad || "");
                    setCountryRoad(data.countryRoad || "");
                    setOnRoad(data.onRoad || "");
                    setOffRoad(data.offRoad || "");
                    setFlatRoad(data.flatRoad || "");
                    setClimbRoad(data.climbRoad || "");

                    // Problem Background
                    setPhenomenon(data.phenomenon || "");
                    setHistoryMaintenance(data.historyMaintenance || "");
                    setFATemporaryInvestigation(data.FATemporaryInvestigation || "");

                    // Result
                    setInvestigationResult(data.investigationResult || "");
                    setCustomerVoice(data.customerVoice || "");
                    setTemporaryAction(data.temporaryAction || "");
                    setHomework(data.homework || "");
                    setOtherCaseTIR(data.otherCaseTIR || "");
                    setDifficultPoint(data.difficultPoint || "");
                }
            });
        }
    }, [id]);

    const handleAddInvestigation = (newInvestigation: InvestigationItem) => {
        setInvestigations((prev) => [...prev, newInvestigation]);
    };


    return (
        <div className="App overflow-x-hidden">
            <div className="pt-16">
                {loading && (
                    <div className="w-full h-full fixed bg-black bg-opacity-50 z-50 top-0 flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                )}
                <div className="w-10/12 mx-auto flex justify-between">
                    <button
                        type="button"
                        className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                    >
                        <IoMdSearch className="mr-2" />
                        Read Context
                    </button>
                    <button
                        type="button"
                        className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                    >
                        <IoMdDownload className="mr-2" />
                        Import TIR
                    </button>
                </div>
                <form className="w-10/12 flex flex-col mx-auto my-8 justify-around items-center" onSubmit={handleSendData}>
                    <TextField
                        label="Context"
                        name="context"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Masukkan context"
                        required={true}
                    />

                    {/* General Information */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">General Information</h2>
                        <div className="flex w-full gap-5">
                            <SelectInput label="Large Classification" name="Large Classification" value={largeClassification} onChange={(e) => { setLargeClassification(e.target.value); setDataMiddleClassification(classificationMap[e.target.value] || []); }} options={problemCategoriesData} />

                            <SelectInput label="Middle Classification" name="Middle Classification" value={middleClassification} onChange={(e) => setMiddleClassification(e.target.value)} options={dataMiddleClassification} />

                            <InputField label="Part Problem" name="partProblem" value={partProblem} onChange={(e) => setPartProblem(e.target.value)} placeholder="Nama Part" />
                        </div>
                        <div className="flex w-full gap-5">
                            <InputField label="Visitor" name="visitor" value={visitor} onChange={(e) => setVisitor(e.target.value)} placeholder="Visitor" />
                            <InputField label="Reviewer" name="reviewer" value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder="Reviewer" />
                            <InputField label="Approval" name="approval" value={approval} onChange={(e) => setApproval(e.target.value)} placeholder="Approval" />
                        </div>
                    </div>

                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Basic Information</h2>
                        <div className="flex w-full gap-5">
                            <InputField label="Nama Customer" name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Masukkan Nama Customer" />
                            <SelectInput label="Dealer" name="dealer" value={dealer} onChange={(e) => setDealer(e.target.value)} options={DealerData} />
                        </div>
                        <div className="flex w-full gap-5">
                            <SelectInput label="Area" name="area" value={area} onChange={(e) => { setArea(e.target.value); setDataLocation(areaMap[e.target.value] || []); }} options={areaData} />
                            <SelectInput label="Lokasi" name="location" value={location} onChange={(e) => setLocation(e.target.value)} options={dataLocation} />
                            <InputField label="Kota" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Masukkan Kota" />
                        </div>
                        <div className="flex w-full gap-5">
                            <SelectInput label="Seri Kendaraan" name="series" value={series} onChange={(e) => setSeries(e.target.value)} options={seriesData} />
                            <SelectInput label="Tipe Kendaraan" name="vehicleType" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} options={vehicleTypesData} />
                            <SelectInput label="Model Fokus" name="focusModel" value={focusModel} onChange={(e) => setFocusModel(e.target.value)} options={focusModelsData} />
                        </div>
                        <div className="flex w-full gap-5">
                            <SelectInput label="Tipe Euro" name="euroType" value={euroType} onChange={(e) => setEuroType(e.target.value)} options={euroTypeData} />
                            <InputField label="VIN" name="VIN" value={VIN} onChange={(e) => setVIN(e.target.value)} placeholder="Masukkan VIN" />
                            <InputField label="EGN" name="EGN" value={EGN} onChange={(e) => setEGN(e.target.value)} placeholder="Masukkan EGN" />
                        </div>
                        <div className="flex w-full gap-5">
                            <InputField label="Payload (KG)" name="payload" type="number" value={payload} onChange={(e) => setPayload(e.target.value)} placeholder="Masukkan Payload" />
                            <InputField label="Jarak Tempuh (KM)" name="mileage" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="Masukkan Jarak Tempuh" />
                            <SelectInput label="Karoseri" name="karoseri" value={karoseri} onChange={(e) => setKaroseri(e.target.value)} options={karoseriCustomersData} />
                        </div>
                        <div className="flex w-full gap-5">
                            <SelectInput label="Segmen" name="segment" value={segment} onChange={(e) => setSegment(e.target.value)} options={segmentData} />
                            <SelectInput label="Aplikasi" name="application" value={application} onChange={(e) => setApplication(e.target.value)} options={cargoTypesData} />
                            <InputField label="LoadingUnit" name="loadingUnit" value={loadingUnit} onChange={(e) => setLoadingUnit(e.target.value)} placeholder="Masukkan LoadingUnit" />
                        </div>
                        <div className="flex w-full gap-5">
                            <InputField label="Tanggal Produksi" name="productionDate" type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} />
                            <InputField label="Tanggal Masalah" name="problemDate" type="date" value={problemDate} onChange={(e) => setProblemDate(e.target.value)} />
                            <InputField label="Tanggal Kunjungan" name="visitDate" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
                            {/* <InputField label="Perbedaan Tanggal" name="dateDifference" value={dateDifference} onChange={(e) => setDateDifference(e.target.value)} placeholder="Masukkan Perbedaan Tanggal" /> */}
                        </div>
                        <SelectInput label="Status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} options={["Breakdown", "Operational"]} />
                    </div>

                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Road Condition</h2>
                        <div className="flex w-full gap-5">
                            <InputField label="Jalan Tol (%)" type="number" name="highway" value={highway} onChange={(e) => setHighway(e.target.value)} placeholder="Masukkan kondisi jalan tol" />
                            <InputField label="Jalan Kota (%)" type="number" name="cityRoad" value={cityRoad} onChange={(e) => setCityRoad(e.target.value)} placeholder="Masukkan kondisi jalan kota" />
                            <InputField label="Jalan Desa (%)" type="number" name="countryRoad" value={countryRoad} onChange={(e) => setCountryRoad(e.target.value)} placeholder="Masukkan kondisi jalan desa" />
                        </div>
                        <div className="flex w-full gap-5">
                            <InputField label="Jalan Aspal (%)" type="number" name="onRoad" value={onRoad} onChange={(e) => setOnRoad(e.target.value)} placeholder="Masukkan kondisi jalan aspal" />
                            <InputField label="Jalan Off-Road (%)" type="number" name="offRoad" value={offRoad} onChange={(e) => setOffRoad(e.target.value)} placeholder="Masukkan kondisi off-road" />
                        </div>
                        <div className="flex w-full gap-5">
                            <InputField label="Jalan Datar (%)" type="number" name="flatRoad" value={flatRoad} onChange={(e) => setFlatRoad(e.target.value)} placeholder="Masukkan kondisi jalan datar" />
                            <InputField label="Jalan Menanjak (%)" type="number" name="climbRoad" value={climbRoad} onChange={(e) => setClimbRoad(e.target.value)} placeholder="Masukkan kondisi jalan menanjak" />
                        </div>
                    </div>


                    {/* Customer Unit */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Customer Unit</h2>
                        <AddUnit units={units} setUnits={setUnits} />
                    </div>

                    {/* Unit Involve */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Unit Involve</h2>
                        <AddUnitInvolve setUnitInvolves={setUnitInvolves} unitInvolves={unitInvolves} />
                    </div>

                    {/* Content of Investigation */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Problem Background</h2>
                        <TextField
                            label="Fenomena"
                            name="phenomenon"
                            value={phenomenon}
                            onChange={(e) => setPhenomenon(e.target.value)}
                            placeholder="Jelaskan fenomena masalah"
                            required={true}
                        />
                        <TextField
                            label="Riwayat Perawatan"
                            name="historyMaintenance"
                            value={historyMaintenance}
                            onChange={(e) => setHistoryMaintenance(e.target.value)}
                            placeholder="Masukkan riwayat perawatan"
                            required={true}
                        />
                        <TextField
                            label="Investigasi Sementara"
                            name="FATemporaryInvestigation"
                            value={FATemporaryInvestigation}
                            onChange={(e) => setFATemporaryInvestigation(e.target.value)}
                            placeholder="Masukkan hasil investigasi sementara"
                            required={true}
                        />
                    </div>

                    {/* Content of Investigation */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Content of Investigation</h2>
                        <AddContentInvestigation investigations={investigations} onAddInvestigation={handleAddInvestigation} />
                    </div>

                    {/* Attachment */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Attachment</h2>
                        <AddAttachment attachments={attachments} setAttachments={setAttachments} />
                    </div>

                    {/* Result */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Result</h2>
                        <TextField
                            label="Hasil Investigasi Akhir"
                            name="investigationResult"
                            value={investigationResult}
                            onChange={(e) => setInvestigationResult(e.target.value)}
                            placeholder="Masukkan hasil investigasi akhir"
                            required
                        />
                        <TextField
                            label="Pendapat Pelanggan"
                            name="customerVoice"
                            value={customerVoice}
                            onChange={(e) => setCustomerVoice(e.target.value)}
                            placeholder="Masukkan pendapat pelanggan"
                            required
                        />
                        <TextField
                            label="Tindakan Sementara"
                            name="temporaryAction"
                            value={temporaryAction}
                            onChange={(e) => setTemporaryAction(e.target.value)}
                            placeholder="Masukkan tindakan sementara"
                            required
                        />
                        <TextField
                            label="PR yang Perlu Dikerjakan"
                            name="homework"
                            value={homework}
                            onChange={(e) => setHomework(e.target.value)}
                            placeholder="Masukkan PR yang perlu dikerjakan"
                            required
                        />
                        <TextField
                            label="Kasus Lain TIR"
                            name="otherCaseTIR"
                            value={otherCaseTIR}
                            onChange={(e) => setOtherCaseTIR(e.target.value)}
                            placeholder="Masukkan kasus lain TIR"
                            required
                        />
                        <TextField
                            label="Poin Sulit"
                            name="difficultPoint"
                            value={difficultPoint}
                            onChange={(e) => setDifficultPoint(e.target.value)}
                            placeholder="Masukkan poin sulit"
                            required
                        />
                    </div>

                    {/* <div className="mt-8 w-full">
                        <Editor HTML={HTML} setDataEdit={setDataEdit} />
                    </div> */}
                    <div className="flex w-full justify-end items-center gap-x-5">
                        <Link
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary rounded-full font-semibold"
                            to="/report"
                        >
                            Kembali
                        </Link>
                        <button
                            type="submit"
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                        >
                            <BiSave className="mr-2" />
                            Save
                        </button>
                        <button
                            type="button"
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                        >
                            <BiSave className="mr-2" />
                            Export
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileReportEditor;