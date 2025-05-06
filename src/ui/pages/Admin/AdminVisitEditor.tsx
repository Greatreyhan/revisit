import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../../utils/FirebaseContext";
import { IoMdDownload, IoMdSearch } from "react-icons/io";
import SelectInput from "../../molecules/SelectInput";
import InputField from "../../molecules/InputField";
import AddAttachment from "../../organisms/AddAttachment";
import TextField from "../../molecules/TextField";
import { areaData, areaMap, cargoTypesData, DealerData, segmentData } from "../../../utils/masterData";
import { AttachmentItem, InvestigationItem, UnitInvolve } from "../../interface/Report";
import { UnitVisit } from "../../interface/Visit";
import AddUnitVisit from "../../organisms/AddUnitVisit";


const AdminVisitEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase, uploadImage, loading, user } = useFirebase()
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Context
    const [context, setContext] = useState<string>("");

    // General Information
    const [formNumber, setFormNumber] = useState<string>("");
    const [visitorName, setVisitorName] = useState<string>("");
    const [visitDate, setVisitDate] = useState<string>("");
    const [visitor, setVisitor] = useState<string>("");
    const [reviewer, setReviewer] = useState<string>("");
    const [approval, setApproval] = useState<string>("");

    // Basic Information
    const [customerName, setCustomerName] = useState<string>("");
    const [dealer, setDealer] = useState<string>("");
    const [dateOperation, setDateOperation] = useState<string>("");
    const [area, setArea] = useState<string>("");
    const [dataLocation, setDataLocation] = useState<string[]>([])
    const [location, setLocation] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [segment, setSegment] = useState<string>("");
    const [application, setApplication] = useState<string>("");
    const [loadingUnit, setLoadingUnit] = useState<string>("");

    // Map
    const [mapAttached, setMapAttached] = useState<string>("");

    // Operational
    const [dayPerWeek, setDayPerWeek] = useState<string>("");
    const [tripPerDay, setTripPerDay] = useState<string>("");
    const [distancePerTrip, setDistancePerTrip] = useState<string>("");
    const [routeOfTrip, setRouteOfTrip] = useState<string>("");

    // Road Condition
    const [highway, setHighway] = useState<string>("");
    const [cityRoad, setCityRoad] = useState<string>("");
    const [countryRoad, setCountryRoad] = useState<string>("");
    const [onRoad, setOnRoad] = useState<string>("");
    const [offRoad, setOffRoad] = useState<string>("");
    const [flatRoad, setFlatRoad] = useState<string>("");
    const [climbRoad, setClimbRoad] = useState<string>("");
    const [maximumSlope, setMaximumSlope] = useState<string>("");
    const [loadingRatio, setLoadingRatio] = useState<string>("");
    const [yearsOfUse, setYearsOfUse] = useState<string>("");


    // Customer Voice
    const [reasonOfPurchase, setReasonOfPurchase] = useState<string>("");
    const [customerInfo, setCustomerInfo] = useState<string>("");
    const [serviceInfo, setServiceInfo] = useState<string>("");
    const [sparepartInfo, setSparepartInfo] = useState<string>("");
    const [technicalInfo, setTechnicalInfo] = useState<string>("");
    const [competitorInfo, setCompetitorInfo] = useState<string>("");

    const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
    const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);
    const [units, setUnits] = useState<UnitVisit[]>([]);
    const [unitInvolves, setUnitInvolves] = useState<UnitInvolve[]>([])


    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi minimal, bisa dikembangkan lebih lanjut
        if (!context || !customerName || !location) {
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

            // Basic Information
            formNumber,
            visitorName,
            visitDate,
            visitor,
            reviewer,
            approval,

            // Map
            mapAttached,

            // Customer Information
            customerName,
            dealer,
            dateOperation,
            area,
            location,
            city,
            segment,
            application,
            loadingUnit,

            // General Information
            dayPerWeek,
            tripPerDay,
            distancePerTrip,
            routeOfTrip,

            // Road Condition
            highway,
            cityRoad,
            countryRoad,
            onRoad,
            offRoad,
            flatRoad,
            climbRoad,
            maximumSlope,
            loadingRatio,
            yearsOfUse,

            // Problem Background
            reasonOfPurchase,
            customerInfo,
            serviceInfo,
            sparepartInfo,
            technicalInfo,
            competitorInfo,

        };

        try {
            console.log(newData)
            await saveToDatabase(`visit/${user?.uid}/${id || Date.now()}`, newData);
            navigate("/visit"); // Navigasi ke halaman setelah submit
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    useEffect(() => {
        if (id) {
            getFromDatabase(`visit/${user?.uid}/${id}`).then((data) => {
                if (data) {
                    // Array data
                    setAttachments(data.attachments);
                    setInvestigations(data.investigations)
                    setUnits(data.units)
                    setUnitInvolves(data.unitInvolves)

                    // Context
                    setContext(data.context || "");

                    // General Information
                    setFormNumber(data.formNumber || "");
                    setVisitorName(data.visitorName || "")
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
                    setSegment(data.segment || "");
                    setApplication(data.application || "");
                    setLoadingUnit(data.loadingUnit || "");
                    setVisitDate(data.visitDate || "");
                    setDateOperation(data.dateOperation || "");

                    // Operational
                    setDayPerWeek(data.dayPerWeek || "")
                    setTripPerDay(data.tripPerDay || "")
                    setDistancePerTrip(data.distancePerTrip || "")
                    setRouteOfTrip(data.routeOfTrip || "")

                    // Map
                    setMapAttached(data.mapAttached || "")

                    // Road Condition
                    setHighway(data.highway || "");
                    setCityRoad(data.cityRoad || "");
                    setCountryRoad(data.countryRoad || "");
                    setOnRoad(data.onRoad || "");
                    setOffRoad(data.offRoad || "");
                    setFlatRoad(data.flatRoad || "");
                    setClimbRoad(data.climbRoad || "");
                    setMaximumSlope(data.maximumSlope || "")
                    setLoadingRatio(data.loadingsetLoadingRatio || "")
                    setYearsOfUse(data.yearsOfUse || "")

                    // Problem Background
                    setReasonOfPurchase(data.reasonOfPurchase || "");
                    setCustomerInfo(data.customerInfo || "");
                    setServiceInfo(data.serviceInfo || "");
                    setSparepartInfo(data.sparepartInfo || "");
                    setTechnicalInfo(data.technicalInfo || "");
                    setCompetitorInfo(data.competitorInfo || "");

                }
            });
        }
    }, [id]);



    return (
        <div className="App overflow-x-hidden">
            <div className="pt-16">
                {loading && (
                    <div className="w-full h-full fixed bg-black bg-opacity-50 z-50 top-0 flex justify-center items-center">
                        <div className="loader"></div>
                    </div>
                )}
                <div className="md:w-10/12 w-11/12 mx-auto flex justify-between">
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
                <form className="md:w-10/12 w-11/12 flex flex-col mx-auto my-8 justify-around items-center" onSubmit={handleSendData}>
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
                        <div className="md:flex w-full gap-5">
                            <InputField label="Form Number" name="Form Number" value={formNumber} onChange={(e) => setFormNumber(e.target.value)} placeholder="Form Number" />

                            <InputField label="Visitor Name" name="Visitor Name" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="Visitor Name" />

                            <InputField label="Tanggal Kunjungan" name="visitDate" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Visitor" name="visitor" value={visitor} onChange={(e) => setVisitor(e.target.value)} placeholder="Visitor" />
                            <InputField label="Reviewer" name="reviewer" value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder="Reviewer" />
                            <InputField label="Approval" name="approval" value={approval} onChange={(e) => setApproval(e.target.value)} placeholder="Approval" />
                        </div>
                    </div>

                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Basic Information</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Nama Customer" name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Masukkan Nama Customer" />
                            <SelectInput label="Dealer" name="dealer" value={dealer} onChange={(e) => setDealer(e.target.value)} options={DealerData} />
                            <InputField label="Tanggal Operasi" name="dateOperation" type="date" value={dateOperation} onChange={(e) => setDateOperation(e.target.value)} />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput label="Area" name="area" value={area} onChange={(e) => { setArea(e.target.value); setDataLocation(areaMap[e.target.value] || []); }} options={areaData} />
                            <SelectInput label="Lokasi" name="location" value={location} onChange={(e) => setLocation(e.target.value)} options={dataLocation} />
                            <InputField label="Kota" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Masukkan Kota" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput label="Segmen" name="segment" value={segment} onChange={(e) => setSegment(e.target.value)} options={segmentData} />
                            <SelectInput label="Aplikasi" name="application" value={application} onChange={(e) => setApplication(e.target.value)} options={cargoTypesData} />
                            <InputField label="LoadingUnit" name="loadingUnit" value={loadingUnit} onChange={(e) => setLoadingUnit(e.target.value)} placeholder="Masukkan LoadingUnit" />
                        </div>
                    </div>

                    {/* Customer Unit */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Customer Unit</h2>
                        <AddUnitVisit units={units} setUnits={setUnits} />
                    </div>

                    {/* Operational */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Operational</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Number of Day Per Week" type="number" name="dayPerWeek" value={dayPerWeek} onChange={(e) => setDayPerWeek(e.target.value)} placeholder="Masukkan jumlah hari kerja" />
                            <InputField label="Number of Trip Per Day" type="number" name="tripPerDay" value={tripPerDay} onChange={(e) => setTripPerDay(e.target.value)} placeholder="Masukkan jumlah trip dalam sehari" />
                            <InputField label="Running Distance Per Trip" type="number" name="distancePerTrip" value={distancePerTrip} onChange={(e) => setDistancePerTrip(e.target.value)} placeholder="Jarak dalam sekali trip" />
                        </div>
                        <InputField label="Route of Trip" type="string" name="routeOfTrip" value={routeOfTrip} onChange={(e) => setRouteOfTrip(e.target.value)} placeholder="Rute trip" />
                    </div>

                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold mb-4">Map Operation</h2>
                        {mapAttached && (
                            <a href={mapAttached} target="_blank" rel="noreferrer">
                                <img className="w-full h-full rounded-md" src={mapAttached} alt="Article" />
                            </a>
                        )}
                        <input
                            required
                            className="mt-4 w-full text-center"
                            onChange={(e) => uploadImage(e, setMapAttached)}
                            name="map"
                            id="map"
                            type="file"
                        />
                    </div>

                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Road Condition</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Jalan Tol (%)" type="number" name="highway" value={highway} onChange={(e) => setHighway(e.target.value)} placeholder="Masukkan kondisi jalan tol" />
                            <InputField label="Jalan Kota (%)" type="number" name="cityRoad" value={cityRoad} onChange={(e) => setCityRoad(e.target.value)} placeholder="Masukkan kondisi jalan kota" />
                            <InputField label="Jalan Desa (%)" type="number" name="countryRoad" value={countryRoad} onChange={(e) => setCountryRoad(e.target.value)} placeholder="Masukkan kondisi jalan desa" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Jalan Aspal (%)" type="number" name="onRoad" value={onRoad} onChange={(e) => setOnRoad(e.target.value)} placeholder="Masukkan kondisi jalan aspal" />
                            <InputField label="Jalan Off-Road (%)" type="number" name="offRoad" value={offRoad} onChange={(e) => setOffRoad(e.target.value)} placeholder="Masukkan kondisi off-road" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Jalan Datar (%)" type="number" name="flatRoad" value={flatRoad} onChange={(e) => setFlatRoad(e.target.value)} placeholder="Masukkan kondisi jalan datar" />
                            <InputField label="Jalan Menanjak (%)" type="number" name="climbRoad" value={climbRoad} onChange={(e) => setClimbRoad(e.target.value)} placeholder="Masukkan kondisi jalan menanjak" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField label="Maximum Slope (%)" type="number" name="maximumSlope" value={maximumSlope} onChange={(e) => setMaximumSlope(e.target.value)} placeholder="Kemiringan Maksimal" />
                            <InputField label="Loading Ratio (%)" type="number" name="loadingRatio" value={loadingRatio} onChange={(e) => setLoadingRatio(e.target.value)} placeholder="Rasio Muatan" />
                            <InputField label="How Many Years Does Customer Want to Use This Unit?" type="number" name="yearsOfUse" value={yearsOfUse} onChange={(e) => setYearsOfUse(e.target.value)} placeholder="Years of Use" />
                        </div>
                    </div>

                    {/* Content of Investigation */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">POV Customer</h2>
                        <TextField
                            label="Reason of Purchase"
                            name="reasonOfPurchase"
                            value={reasonOfPurchase}
                            onChange={(e) => setReasonOfPurchase(e.target.value)}
                            placeholder="Alasan Pembelian Unit"
                            required={true}
                        />
                        <TextField
                            label="Customer Information"
                            name="customerInfo"
                            value={customerInfo}
                            onChange={(e) => setCustomerInfo(e.target.value)}
                            placeholder="Informasi Customer"
                            required={true}
                        />
                        <TextField
                            label="Service Information"
                            name="serviceInfo"
                            value={serviceInfo}
                            onChange={(e) => setServiceInfo(e.target.value)}
                            placeholder="Informasi Service"
                            required={true}
                        />
                        <TextField
                            label="Sparepart Information"
                            name="sparepartInformation"
                            value={sparepartInfo}
                            onChange={(e) => setSparepartInfo(e.target.value)}
                            placeholder="Informasi Sparepart"
                            required={true}
                        />
                        <TextField
                            label="Technical Information"
                            name="technicalInfo"
                            value={technicalInfo}
                            onChange={(e) => setTechnicalInfo(e.target.value)}
                            placeholder="Informasi Teknis"
                            required={true}
                        />
                        <TextField
                            label="Competitor Information"
                            name="competitorInfo"
                            value={competitorInfo}
                            onChange={(e) => setCompetitorInfo(e.target.value)}
                            placeholder="Informasi Kompetitor"
                            required={true}
                        />
                    </div>

                    {/* Attachment */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Attachment</h2>
                        <AddAttachment attachments={attachments} setAttachments={setAttachments} />
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

export default AdminVisitEditor;