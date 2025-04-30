import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../utils/FirebaseContext";
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
    const { saveToDatabase, user, waiting, updateImage, getFromDatabase } = useFirebase();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Context
    const [context, setContext] = useState<string>("");

    // General Information
    const [largeClassification, setLargeClassification] = useState<string>("");
    const [dataMiddleClassification, setDataMiddleClassification] = useState<string[]>([]);
    const [middleClassification, setMiddleClassification] = useState<string>("");
    const [partProblem, setPartProblem] = useState<string>("");
    const [visitor, setVisitor] = useState<string>("");
    const [reviewer, setReviewer] = useState<string>("");
    const [approval, setApproval] = useState<string>("");

    // Vehicle Information
    const [customerName, setCustomerName] = useState<string>("");
    const [area, setArea] = useState<string>("");
    const [dataLocation, setDataLocation] = useState<string[]>([]);
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
    const [unitInvolves, setUnitInvolves] = useState<UnitInvolve[]>([]);

    // State to check if data has been changed
    const [isDataChanged, setIsDataChanged] = useState<boolean>(false);

    // Function to detect input changes
    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setter(e.target.value);
        setIsDataChanged(true);
    };

    const getFormData = () => ({
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
    });

    useEffect(() => {
        if (id) {
            waiting(true)
            getFromDatabase(`report/${user?.uid}/${id}`).then((data) => {
                if (data) {
                    // Array data
                    setAttachments(data.attachments || []);
                    setInvestigations(data.investigations || [])
                    setUnits(data.units || [])
                    setUnitInvolves(data.unitInvolves || [])

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
            waiting(false)
        }
    }, [id]);


    useEffect(() => {
        if (isDataChanged) {
            const formData = getFormData();
            localStorage.setItem("profileReportDraft", JSON.stringify(formData));
        }
    }, [
        context,
        largeClassification,
        middleClassification,
        partProblem,
        visitor,
        reviewer,
        approval,
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
        highway,
        cityRoad,
        countryRoad,
        onRoad,
        offRoad,
        flatRoad,
        climbRoad,
        phenomenon,
        historyMaintenance,
        FATemporaryInvestigation,
        investigationResult,
        customerVoice,
        temporaryAction,
        homework,
        otherCaseTIR,
        difficultPoint,
        attachments,
        investigations,
        units,
        unitInvolves,
        isDataChanged,
    ]);

    useEffect(() => {
        const savedDraft = localStorage.getItem("profileReportDraft");
        if (savedDraft) {
            const confirmLoad = window.confirm("Terdapat data yang belum tersimpan. Apakah Anda ingin mengembalikannya?");
            if (confirmLoad) {
                const data = JSON.parse(savedDraft);
                // Set semua state sesuai data draft
                setAttachments(data.attachments || []);
                setInvestigations(data.investigations || []);
                setUnits(data.units || []);
                setUnitInvolves(data.unitInvolves || []);

                setContext(data.context || "");
                setLargeClassification(data.largeClassification || "");
                setMiddleClassification(data.middleClassification || "");
                setPartProblem(data.partProblem || "");
                setVisitor(data.visitor || "");
                setReviewer(data.reviewer || "");
                setApproval(data.approval || "");

                setCustomerName(data.customerName || "");
                setArea(data.area || "");
                setLocation(data.location || "");
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

                setHighway(data.highway || "");
                setCityRoad(data.cityRoad || "");
                setCountryRoad(data.countryRoad || "");
                setOnRoad(data.onRoad || "");
                setOffRoad(data.offRoad || "");
                setFlatRoad(data.flatRoad || "");
                setClimbRoad(data.climbRoad || "");

                setPhenomenon(data.phenomenon || "");
                setHistoryMaintenance(data.historyMaintenance || "");
                setFATemporaryInvestigation(data.FATemporaryInvestigation || "");

                setInvestigationResult(data.investigationResult || "");
                setCustomerVoice(data.customerVoice || "");
                setTemporaryAction(data.temporaryAction || "");
                setHomework(data.homework || "");
                setOtherCaseTIR(data.otherCaseTIR || "");
                setDifficultPoint(data.difficultPoint || "");

                // Setelah mengembalikan data, data draft sudah dipulihkan
                setIsDataChanged(false);
            } else {
                // Jika pengguna memilih tidak mengembalikan, hapus data draft
                localStorage.removeItem("profileReportDraft");
            }
        }
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDataChanged) {
                event.preventDefault();
                event.returnValue = "You have unsaved changes. Are you sure you want to leave?";
            }
        };

        const handleBackButton = () => {
            if (isDataChanged) {
                const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave this page?");
                if (!confirmLeave) {
                    window.history.pushState(null, "", window.location.href);
                }
            }
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [isDataChanged]);


    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();
        waiting(true);
        const newData = getFormData();

        try {
            attachments?.forEach(data => {
                updateImage(data?.imageId?.toString() ?? "", "uploaded");
            });
            await saveToDatabase(`report/${user?.uid}/${id || Date.now()}`, newData);
            waiting(false);
            setIsDataChanged(false);
            // Setelah data berhasil dikirim, hapus data draft dari localStorage
            localStorage.removeItem("profileReportDraft");
            navigate("/report");
        } catch (error) {
            console.error("Error saving data:", error);
            waiting(false);
        }
    };

    return (
        <div className="App overflow-x-hidden">
            <div className="pt-16">
                <form className="md:w-10/12 w-11/12 flex flex-col mx-auto my-4 justify-around items-center" onSubmit={handleSendData}>
                    <TextField
                        label="Note"
                        name="context"
                        value={context}
                        onChange={handleChange(setContext)}
                        placeholder="Enter Note"
                    />

                    {/* General Information */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">General Information</h2>
                        <div className="md:flex w-full gap-5">
                            <SelectInput
                                required={true}
                                label="Large Classification"
                                name="largeClassification"
                                value={largeClassification}
                                onChange={(e) => {
                                    setLargeClassification(e.target.value);
                                    setDataMiddleClassification(classificationMap[e.target.value] || []);
                                }}
                                options={problemCategoriesData}
                            />
                            <SelectInput
                                required={true}
                                label="Middle Classification"
                                name="middleClassification"
                                value={middleClassification}
                                onChange={handleChange(setMiddleClassification)}
                                options={dataMiddleClassification}
                            />
                            <InputField
                                required={true}
                                label="Part Problem"
                                name="partProblem"
                                value={partProblem}
                                onChange={handleChange(setPartProblem)}
                                placeholder="Enter part name"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                required={true}
                                label="Visitor"
                                name="visitor"
                                value={visitor}
                                onChange={handleChange(setVisitor)}
                                placeholder="Enter visitor"
                            />
                            <InputField
                                label="Reviewer"
                                name="reviewer"
                                value={reviewer}
                                onChange={handleChange(setReviewer)}
                                placeholder="Enter reviewer"
                            />
                            <InputField
                                label="Approval"
                                name="approval"
                                value={approval}
                                onChange={handleChange(setApproval)}
                                placeholder="Enter approval"
                            />
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Basic Information</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                required={true}
                                label="Customer Name"
                                name="customerName"
                                value={customerName}
                                onChange={handleChange(setCustomerName)}
                                placeholder="Enter customer name"
                            />
                            <SelectInput
                                required={true}
                                label="Dealer"
                                name="dealer"
                                value={dealer}
                                onChange={handleChange(setDealer)}
                                options={DealerData}
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput
                                required={true}
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
                                required={true}
                                label="Location"
                                name="location"
                                value={location}
                                onChange={handleChange(setLocation)}
                                options={dataLocation}
                            />
                            <InputField
                                required={true}
                                label="City"
                                name="city"
                                value={city}
                                onChange={handleChange(setCity)}
                                placeholder="Enter city"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput
                                required={true}
                                label="Vehicle Series"
                                name="series"
                                value={series}
                                onChange={handleChange(setSeries)}
                                options={seriesData}
                            />
                            <SelectInput
                                required={true}
                                label="Vehicle Type"
                                name="vehicleType"
                                value={vehicleType}
                                onChange={handleChange(setVehicleType)}
                                options={vehicleTypesData}
                            />
                            <SelectInput
                                required={true}
                                label="Focus Model"
                                name="focusModel"
                                value={focusModel}
                                onChange={handleChange(setFocusModel)}
                                options={focusModelsData}
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput
                                required={true}
                                label="Euro Type"
                                name="euroType"
                                value={euroType}
                                onChange={handleChange(setEuroType)}
                                options={euroTypeData}
                            />
                            <InputField
                                required={true}
                                label="VIN"
                                name="VIN"
                                value={VIN}
                                onChange={handleChange(setVIN)}
                                placeholder="Enter VIN"
                            />
                            <InputField
                                required={true}
                                label="EGN"
                                name="EGN"
                                value={EGN}
                                onChange={handleChange(setEGN)}
                                placeholder="Enter EGN"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                label="Payload (KG)"
                                name="payload"
                                type="number"
                                value={payload}
                                onChange={handleChange(setPayload)}
                                placeholder="Enter payload"
                            />
                            <InputField
                                label="Mileage (KM)"
                                name="mileage"
                                type="number"
                                value={mileage}
                                onChange={handleChange(setMileage)}
                                placeholder="Enter mileage"
                            />
                            <SelectInput
                                label="Karoseri"
                                name="karoseri"
                                value={karoseri}
                                onChange={handleChange(setKaroseri)}
                                options={karoseriCustomersData}
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput
                                label="Segment"
                                name="segment"
                                value={segment}
                                onChange={handleChange(setSegment)}
                                options={segmentData}
                            />
                            <SelectInput
                                label="Application"
                                name="application"
                                value={application}
                                onChange={handleChange(setApplication)}
                                options={cargoTypesData}
                            />
                            <InputField
                                label="Loading Unit"
                                name="loadingUnit"
                                value={loadingUnit}
                                onChange={handleChange(setLoadingUnit)}
                                placeholder="Enter loading unit"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                label="Production Date"
                                name="productionDate"
                                type="date"
                                value={productionDate}
                                onChange={handleChange(setProductionDate)}
                            />
                            <InputField
                                label="Problem Date"
                                name="problemDate"
                                type="date"
                                value={problemDate}
                                onChange={handleChange(setProblemDate)}
                            />
                            <InputField
                                label="Visit Date"
                                name="visitDate"
                                type="date"
                                value={visitDate}
                                onChange={handleChange(setVisitDate)}
                            />
                        </div>
                        <SelectInput
                            required={true}
                            label="Status"
                            name="status"
                            value={status}
                            onChange={handleChange(setStatus)}
                            options={["Breakdown", "Operational"]}
                        />
                    </div>

                    {/* Road Condition */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Road Condition</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                label="Highway (%)"
                                type="number"
                                name="highway"
                                value={highway}
                                onChange={handleChange(setHighway)}
                                placeholder="Enter highway condition (%)"
                            />
                            <InputField
                                label="City Road (%)"
                                type="number"
                                name="cityRoad"
                                value={cityRoad}
                                onChange={handleChange(setCityRoad)}
                                placeholder="Enter city road condition (%)"
                            />
                            <InputField
                                label="Rural Road (%)"
                                type="number"
                                name="countryRoad"
                                value={countryRoad}
                                onChange={handleChange(setCountryRoad)}
                                placeholder="Enter rural road condition (%)"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                label="On Road (%)"
                                type="number"
                                name="onRoad"
                                value={onRoad}
                                onChange={handleChange(setOnRoad)}
                                placeholder="Enter on road condition (%)"
                            />
                            <InputField
                                label="Off-Road (%)"
                                type="number"
                                name="offRoad"
                                value={offRoad}
                                onChange={handleChange(setOffRoad)}
                                placeholder="Enter off-road condition (%)"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                label="Flat Road (%)"
                                type="number"
                                name="flatRoad"
                                value={flatRoad}
                                onChange={handleChange(setFlatRoad)}
                                placeholder="Enter flat road condition (%)"
                            />
                            <InputField
                                label="Uphill Road (%)"
                                type="number"
                                name="climbRoad"
                                value={climbRoad}
                                onChange={handleChange(setClimbRoad)}
                                placeholder="Enter uphill road condition (%)"
                            />
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

                    {/* Problem Background */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Problem Background</h2>
                        <TextField
                            label="Phenomenon"
                            name="phenomenon"
                            value={phenomenon}
                            onChange={handleChange(setPhenomenon)}
                            placeholder="Describe the phenomenon"
                        />
                        <TextField
                            label="Maintenance History"
                            name="historyMaintenance"
                            value={historyMaintenance}
                            onChange={handleChange(setHistoryMaintenance)}
                            placeholder="Enter maintenance history"
                        />
                        <TextField
                            label="Temporary Investigation"
                            name="FATemporaryInvestigation"
                            value={FATemporaryInvestigation}
                            onChange={handleChange(setFATemporaryInvestigation)}
                            placeholder="Enter temporary investigation results"
                        />
                    </div>

                    {/* Content of Investigation */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Content of Investigation</h2>
                        <AddContentInvestigation investigations={investigations} setInvestigations={setInvestigations} />
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
                            label="Final Investigation Result"
                            name="investigationResult"
                            value={investigationResult}
                            onChange={handleChange(setInvestigationResult)}
                            placeholder="Enter final investigation result"
                        />
                        <TextField
                            label="Customer Opinion"
                            name="customerVoice"
                            value={customerVoice}
                            onChange={handleChange(setCustomerVoice)}
                            placeholder="Enter customer opinion"
                        />
                        <TextField
                            label="Temporary Action"
                            name="temporaryAction"
                            value={temporaryAction}
                            onChange={handleChange(setTemporaryAction)}
                            placeholder="Enter temporary action"
                        />
                        <TextField
                            label="Homework"
                            name="homework"
                            value={homework}
                            onChange={handleChange(setHomework)}
                            placeholder="Enter homework to be done"
                        />
                        <TextField
                            label="Other TIR Cases"
                            name="otherCaseTIR"
                            value={otherCaseTIR}
                            onChange={handleChange(setOtherCaseTIR)}
                            placeholder="Enter other TIR cases"
                        />
                        <TextField
                            label="Difficult Point"
                            name="difficultPoint"
                            value={difficultPoint}
                            onChange={handleChange(setDifficultPoint)}
                            placeholder="Enter difficult point"
                        />
                    </div>

                    <div className="fixed md:hidden block bottom-5 right-5">
                        <button
                            type="submit"
                            className="mt-4 p-3 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                        >
                            <BiSave className="text-2xl" />
                        </button>
                    </div>

                    <div className="flex w-full justify-end items-center gap-x-5">
                        <Link
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary rounded-full font-semibold"
                            to="/report"
                        >
                            Back
                        </Link>
                        <button
                            type="submit"
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                        >
                            <BiSave className="mr-2" />
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileReportEditor;
