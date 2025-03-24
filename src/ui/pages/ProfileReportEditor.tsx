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
    const { saveToDatabase, getFromDatabase, user, waiting } = useFirebase()
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

    // State untuk mengecek apakah data sudah diubah
    const [isDataChanged, setIsDataChanged] = useState<boolean>(false);

    // Fungsi untuk mendeteksi perubahan input
    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setter(e.target.value);
        setIsDataChanged(true); // Set bahwa ada perubahan data
    };
    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();
        waiting(true)
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
            await saveToDatabase(`report/${user?.uid}/${id || Date.now()}`, newData);
            waiting(false)
            setIsDataChanged(false)
            navigate("/report"); // Navigasi ke halaman setelah submit
        } catch (error) {
            console.error("Error saving data:", error);
            waiting(false)
        }
    };

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
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDataChanged) {
                event.preventDefault();
                event.returnValue = "Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar?";
            }
        };

        const handleBackButton = () => {
            if (isDataChanged) {
                const confirmLeave = window.confirm("Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?");
                if (!confirmLeave) {
                    // Dorong kembali state agar tetap di halaman saat tombol Back ditekan
                    window.history.pushState(null, "", window.location.href);
                }
            }
        };

        // Tambahkan state baru ke history agar kita bisa mengendalikan navigasi
        window.history.pushState(null, "", window.location.href);

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [isDataChanged]);


    return (
        <div className="App overflow-x-hidden">
            <div className="pt-16">
                <form className="md:w-10/12 w-11/12 flex flex-col mx-auto my-4 justify-around items-center" onSubmit={handleSendData}>

                    <TextField
                        label="Context"
                        name="context"
                        value={context}
                        onChange={handleChange(setContext)}
                        placeholder="Masukkan context"

                    />

                    {/* General Information */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">General Information</h2>
                        <div className="md:flex w-full gap-5">
                            <SelectInput required={true} label="Large Classification" name="Large Classification" value={largeClassification} onChange={(e) => { setLargeClassification(e.target.value); setDataMiddleClassification(classificationMap[e.target.value] || []); }} options={problemCategoriesData} />

                            <SelectInput required={true} label="Middle Classification" name="Middle Classification" value={middleClassification} onChange={handleChange(setMiddleClassification)} options={dataMiddleClassification} />

                            <InputField required={true} label="Part Problem" name="partProblem" value={partProblem} onChange={handleChange(setPartProblem)} placeholder="Nama Part" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField required={true} label="Visitor" name="visitor" value={visitor} onChange={handleChange(setVisitor)} placeholder="Visitor" />
                            <InputField label="Reviewer" name="reviewer" value={reviewer} onChange={handleChange(setReviewer)} placeholder="Reviewer" />
                            <InputField label="Approval" name="approval" value={approval} onChange={handleChange(setApproval)} placeholder="Approval" />
                        </div>
                    </div>

                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Basic Information</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField required={true} label="Nama Customer" name="customerName" value={customerName} onChange={handleChange(setCustomerName)} placeholder="Masukkan Nama Customer" />
                            <SelectInput required={true} label="Dealer" name="dealer" value={dealer} onChange={handleChange(setDealer)} options={DealerData} />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput required={true} label="Area" name="area" value={area} onChange={(e)=>{ setArea(e.target.value); setDataLocation(areaMap[e.target.value] || []); }} options={areaData} />
                            <SelectInput required={true} label="Lokasi" name="location" value={location} onChange={handleChange(setLocation)} options={dataLocation} />
                            <InputField required={true} label="Kota" name="city" value={city} onChange={handleChange(setCity)} placeholder="Masukkan Kota" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput required={true} label="Seri Kendaraan" name="series" value={series} onChange={handleChange(setSeries)} options={seriesData} />
                            <SelectInput required={true} label="Tipe Kendaraan" name="vehicleType" value={vehicleType} onChange={handleChange(setVehicleType)} options={vehicleTypesData} />
                            <SelectInput required={true} label="Model Fokus" name="focusModel" value={focusModel} onChange={handleChange(setFocusModel)} options={focusModelsData} />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput required={true} label="Tipe Euro" name="euroType" value={euroType} onChange={handleChange(setEuroType)} options={euroTypeData} />
                            <InputField required={true} label="VIN" name="VIN" value={VIN} onChange={handleChange(setVIN)} placeholder="Masukkan VIN" />
                            <InputField required={true} label="EGN" name="EGN" value={EGN} onChange={handleChange(setEGN)} placeholder="Masukkan EGN" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Payload (KG)" name="payload" type="number" value={payload} onChange={handleChange(setPayload)} placeholder="Masukkan Payload" />
                            <InputField label="Jarak Tempuh (KM)" name="mileage" type="number" value={mileage} onChange={handleChange(setMileage)} placeholder="Masukkan Jarak Tempuh" />
                            <SelectInput label="Karoseri" name="karoseri" value={karoseri} onChange={handleChange(setKaroseri)} options={karoseriCustomersData} />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput label="Segmen" name="segment" value={segment} onChange={handleChange(setSegment)} options={segmentData} />
                            <SelectInput label="Aplikasi" name="application" value={application} onChange={handleChange(setApplication)} options={cargoTypesData} />
                            <InputField label="LoadingUnit" name="loadingUnit" value={loadingUnit} onChange={handleChange(setLoadingUnit)} placeholder="Masukkan LoadingUnit" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Tanggal Produksi" name="productionDate" type="date" value={productionDate} onChange={handleChange(setProductionDate)} />
                            <InputField label="Tanggal Masalah" name="problemDate" type="date" value={problemDate} onChange={handleChange(setProblemDate)} />
                            <InputField label="Tanggal Kunjungan" name="visitDate" type="date" value={visitDate} onChange={handleChange(setVisitDate)} />
                            {/* <InputField label="Perbedaan Tanggal" name="dateDifference" value={dateDifference} onChange={handleChange(setDateDifference)} placeholder="Masukkan Perbedaan Tanggal" /> */}
                        </div>
                        <SelectInput required={true} label="Status" name="status" value={status} onChange={handleChange(setStatus)} options={["Breakdown", "Operational"]} />
                    </div>

                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Road Condition</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Jalan Tol (%)" type="number" name="highway" value={highway} onChange={handleChange(setHighway)} placeholder="Masukkan kondisi jalan tol" />
                            <InputField label="Jalan Kota (%)" type="number" name="cityRoad" value={cityRoad} onChange={handleChange(setCityRoad)} placeholder="Masukkan kondisi jalan kota" />
                            <InputField label="Jalan Desa (%)" type="number" name="countryRoad" value={countryRoad} onChange={handleChange(setCountryRoad)} placeholder="Masukkan kondisi jalan desa" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Jalan Aspal (%)" type="number" name="onRoad" value={onRoad} onChange={handleChange(setOnRoad)} placeholder="Masukkan kondisi jalan aspal" />
                            <InputField label="Jalan Off-Road (%)" type="number" name="offRoad" value={offRoad} onChange={handleChange(setOffRoad)} placeholder="Masukkan kondisi off-road" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Jalan Datar (%)" type="number" name="flatRoad" value={flatRoad} onChange={handleChange(setFlatRoad)} placeholder="Masukkan kondisi jalan datar" />
                            <InputField label="Jalan Menanjak (%)" type="number" name="climbRoad" value={climbRoad} onChange={handleChange(setClimbRoad)} placeholder="Masukkan kondisi jalan menanjak" />
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
                            onChange={handleChange(setPhenomenon)}
                            placeholder="Jelaskan fenomena masalah"

                        />
                        <TextField
                            label="Riwayat Perawatan"
                            name="historyMaintenance"
                            value={historyMaintenance}
                            onChange={handleChange(setHistoryMaintenance)}
                            placeholder="Masukkan riwayat perawatan"

                        />
                        <TextField
                            label="Investigasi Sementara"
                            name="FATemporaryInvestigation"
                            value={FATemporaryInvestigation}
                            onChange={handleChange(setFATemporaryInvestigation)}
                            placeholder="Masukkan hasil investigasi sementara"

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
                            label="Hasil Investigasi Akhir"
                            name="investigationResult"
                            value={investigationResult}
                            onChange={handleChange(setInvestigationResult)}
                            placeholder="Masukkan hasil investigasi akhir"

                        />
                        <TextField
                            label="Pendapat Pelanggan"
                            name="customerVoice"
                            value={customerVoice}
                            onChange={handleChange(setCustomerVoice)}
                            placeholder="Masukkan pendapat pelanggan"

                        />
                        <TextField
                            label="Tindakan Sementara"
                            name="temporaryAction"
                            value={temporaryAction}
                            onChange={handleChange(setTemporaryAction)}
                            placeholder="Masukkan tindakan sementara"

                        />
                        <TextField
                            label="PR yang Perlu Dikerjakan"
                            name="homework"
                            value={homework}
                            onChange={handleChange(setHomework)}
                            placeholder="Masukkan PR yang perlu dikerjakan"

                        />
                        <TextField
                            label="Kasus Lain TIR"
                            name="otherCaseTIR"
                            value={otherCaseTIR}
                            onChange={handleChange(setOtherCaseTIR)}
                            placeholder="Masukkan kasus lain TIR"

                        />
                        <TextField
                            label="Poin Sulit"
                            name="difficultPoint"
                            value={difficultPoint}
                            onChange={handleChange(setDifficultPoint)}
                            placeholder="Masukkan poin sulit"

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
                        {/* <button
                            type="button"
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-primary rounded-full text-white font-semibold"
                        >
                            <BiSave className="mr-2" />
                            Export
                        </button> */}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileReportEditor;