import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../utils/FirebaseContext";
import SelectInput from "../molecules/SelectInput";
import InputField from "../molecules/InputField";
import AddAttachment from "../organisms/AddAttachment";
import TextField from "../molecules/TextField";
import { areaData, areaMap, DealerData, segmentData } from "../../utils/masterData";
import { AttachmentItem, InvestigationItem, UnitInvolve } from "../interface/Report";
import { UnitVisit } from "../interface/Visit";
import AddUnitVisit from "../organisms/AddUnitVisit";
import { MapMarkerData } from "../interface/MapSelector";
import MapDistance from "../organisms/MapDistance";


const ProfileVisitEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase, user, updateImage } = useFirebase()
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
    // const [application, setApplication] = useState<string>("");
    // const [loadingUnit, setLoadingUnit] = useState<string>("");

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
    const [mapMarkers, setMapMarkers] = useState<MapMarkerData[]>([])
    const [mapDistance, setMapDistance] = useState<number | null>(0)
    const [locationMap, setLocationMap] = useState<MapMarkerData>({lat: 0,lng: 0})


    // UI
    const [showMap, setShowMap] = useState<boolean>(false)

    // State untuk mengecek apakah data sudah diubah
    const [isDataChanged, setIsDataChanged] = useState<boolean>(false);

    // Fungsi untuk mendeteksi perubahan input
    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setter(e.target.value);
        setIsDataChanged(true); // Set bahwa ada perubahan data
    };

    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi minimal, bisa dikembangkan lebih lanjut
        if (!customerName || !location) {
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
            mapMarkers,
            mapDistance,
            locationMap,

            // Customer Information
            customerName,
            dealer,
            dateOperation,
            area,
            location,
            city,
            segment,

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
            attachments?.map(data=>{
                updateImage(data?.imageId?.toString() ?? "", "uploaded")
            })
            await saveToDatabase(`visit/${user?.uid}/${id || Date.now()}`, newData);
            setIsDataChanged(false); // Set bahwa data sudah tersimpan
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
                    setAttachments(data.attachments || []);
                    setInvestigations(data.investigations || [])
                    setUnits(data.units || [])
                    setUnitInvolves(data.unitInvolves || [])

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
                    // setApplication(data.application || "");
                    // setLoadingUnit(data.loadingUnit || "");
                    setVisitDate(data.visitDate || "");
                    setDateOperation(data.dateOperation || "");

                    // Operational
                    setDayPerWeek(data.dayPerWeek || "")
                    setTripPerDay(data.tripPerDay || "")
                    setDistancePerTrip(data.distancePerTrip || "")
                    setRouteOfTrip(data.routeOfTrip || "")

                    // Map
                    setMapAttached(data.mapAttached || "")
                    setMapMarkers(data.mapMarkers || [])
                    setMapDistance(data.mapDistance || 0)
                    setLocationMap(data.locationMap || {lat: 0,lng: 0})

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
                <form className="md:w-10/12 w-11/12 flex flex-col mx-auto my-8 justify-around items-center" onSubmit={handleSendData}>
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
                            <InputField label="Form Number" name="Form Number" value={formNumber} onChange={handleChange(setFormNumber)} placeholder="Form Number" />

                            <InputField required={true} label="Visitor Name" name="Visitor Name" value={visitorName} onChange={handleChange(setVisitorName)} placeholder="Visitor Name" />

                            <InputField required={true} label="Tanggal Kunjungan" name="visitDate" type="date" value={visitDate} onChange={handleChange(setVisitDate)} />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField required={true} label="Visitor" name="visitor" value={visitor} onChange={handleChange(setVisitor)} placeholder="Visitor" />
                            <InputField label="Reviewer" name="reviewer" value={reviewer} onChange={handleChange(setReviewer)} placeholder="Reviewer" />
                            <InputField label="Approval" name="approval" value={approval} onChange={handleChange(setApproval)} placeholder="Approval" />
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Basic Information</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField required={true} label="Nama Customer" name="customerName" value={customerName} onChange={handleChange(setCustomerName)} placeholder="Masukkan Nama Customer" />
                            <SelectInput required={true} label="Dealer" name="dealer" value={dealer} onChange={handleChange(setDealer)} options={DealerData} />
                            <InputField label="Tanggal Operasi" name="dateOperation" type="date" value={dateOperation} onChange={handleChange(setDateOperation)} />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput required={true} label="Area" name="area" value={area} onChange={(e) => { setArea(e.target.value); setDataLocation(areaMap[e.target.value] || []); }} options={areaData} />
                            <SelectInput required={true} label="Lokasi" name="location" value={location} onChange={handleChange(setLocation)} options={dataLocation} />
                            <InputField required={true} label="Kota" name="city" value={city} onChange={handleChange(setCity)} placeholder="Masukkan Kota" />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput required={true} label="Segmen" name="segment" value={segment} onChange={handleChange(setSegment)} options={segmentData} />
                            {/* <SelectInput label="Aplikasi" name="application" value={application} onChange={handleChange(setApplication)} options={cargoTypesData} /> */}
                            {/* <InputField label="LoadingUnit" name="loadingUnit" value={loadingUnit} onChange={handleChange(setLoadingUnit)} placeholder="Masukkan LoadingUnit" /> */}
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
                            <InputField label="Number of Day Per Week" type="number" name="dayPerWeek" value={dayPerWeek} onChange={handleChange(setDayPerWeek)} placeholder="Masukkan jumlah hari kerja" />
                            <InputField label="Number of Trip Per Day" type="number" name="tripPerDay" value={tripPerDay} onChange={handleChange(setTripPerDay)} placeholder="Masukkan jumlah trip dalam sehari" />
                            <InputField label="Running Distance Per Trip" type="number" name="distancePerTrip" value={distancePerTrip} onChange={handleChange(setDistancePerTrip)} placeholder="Jarak dalam sekali trip" />
                        </div>
                        <InputField label="Route of Trip" type="string" name="routeOfTrip" value={routeOfTrip} onChange={handleChange(setRouteOfTrip)} placeholder="Rute trip" />
                    </div>

                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold mb-4">Map Operation</h2>
                        <div className="relative w-full flex justify-center -mb-12 z-10">
                            <button className={`mt-4 px-6 py-2 justify-center items-center bg-primary rounded-full text-white font-semibold ${showMap ? "hidden" : "inline-flex"}`} onClick={() => setShowMap(true)} type="button">Tambah Titik</button>
                        </div>
                        <MapDistance setLocationMap={setLocationMap} locationMap={locationMap || {lat: 0,lng: 0}} setMarkers={setMapMarkers} markers={mapMarkers} setDistance={setMapDistance} distance={mapDistance ?? 0} setShow={setShowMap} show={showMap} />
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
                        <div className="md:flex w-full gap-5">
                            <InputField label="Maximum Slope (%)" type="number" name="maximumSlope" value={maximumSlope} onChange={handleChange(setMaximumSlope)} placeholder="Kemiringan Maksimal" />
                            <InputField label="Loading Ratio (%)" type="number" name="loadingRatio" value={loadingRatio} onChange={handleChange(setLoadingRatio)} placeholder="Rasio Muatan" />
                            <InputField label="How Many Years Does Customer Want to Use This Unit?" type="number" name="yearsOfUse" value={yearsOfUse} onChange={handleChange(setYearsOfUse)} placeholder="Years of Use" />
                        </div>
                    </div>

                    {/* Content of Investigation */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">POV Customer</h2>
                        <TextField
                            label="Reason of Purchase"
                            name="reasonOfPurchase"
                            value={reasonOfPurchase}
                            onChange={handleChange(setReasonOfPurchase)}
                            placeholder="Alasan Pembelian Unit"

                        />
                        <TextField
                            label="Customer Information"
                            name="customerInfo"
                            value={customerInfo}
                            onChange={handleChange(setCustomerInfo)}
                            placeholder="Informasi Customer"

                        />
                        <TextField
                            label="Service Information"
                            name="serviceInfo"
                            value={serviceInfo}
                            onChange={handleChange(setServiceInfo)}
                            placeholder="Informasi Service"

                        />
                        <TextField
                            label="Sparepart Information"
                            name="sparepartInformation"
                            value={sparepartInfo}
                            onChange={handleChange(setSparepartInfo)}
                            placeholder="Informasi Sparepart"

                        />
                        <TextField
                            label="Technical Information"
                            name="technicalInfo"
                            value={technicalInfo}
                            onChange={handleChange(setTechnicalInfo)}
                            placeholder="Informasi Teknis"

                        />
                        <TextField
                            label="Competitor Information"
                            name="competitorInfo"
                            value={competitorInfo}
                            onChange={handleChange(setCompetitorInfo)}
                            placeholder="Informasi Kompetitor"

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

                    <div className="flex w-full justify-end items-center gap-x-5">
                        <Link
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary rounded-full font-semibold"
                            to="/visit"
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
 
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileVisitEditor;