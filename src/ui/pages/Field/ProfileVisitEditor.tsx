import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiSave } from "react-icons/bi";
import { useFirebase } from "../../../utils/FirebaseContext";
import SelectInput from "../../molecules/SelectInput";
import InputField from "../../molecules/InputField";
import AddAttachment from "../../organisms/AddAttachment";
import TextField from "../../molecules/TextField";
import { areaData, areaMap, DealerData, segmentData } from "../../../utils/masterData";
import { AttachmentItem, InvestigationItem, UnitInvolve } from "../../interface/Report";
import { UnitVisit } from "../../interface/Visit";
import AddUnitVisit from "../../organisms/AddUnitVisit";
import { MapMarkerData } from "../../interface/MapSelector";
import MapDistance from "../../organisms/MapDistance";

const ProfileVisitEditor: React.FC = () => {
    const { saveToDatabase, user, updateImage, getFromDatabase } = useFirebase();
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
    const [dataLocation, setDataLocation] = useState<string[]>([]);
    const [location, setLocation] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [segment, setSegment] = useState<string>("");

    // Map
    const [mapAttached, setMapAttached] = useState<string>("");
    const [mapMarkers, setMapMarkers] = useState<MapMarkerData[]>([]);
    const [mapDistance, setMapDistance] = useState<number | null>(0);
    const [locationMap, setLocationMap] = useState<MapMarkerData>({ lat: 0, lng: 0 });

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

    // Customer Voice / Problem Background
    const [reasonOfPurchase, setReasonOfPurchase] = useState<string>("");
    const [customerInfo, setCustomerInfo] = useState<string>("");
    const [serviceInfo, setServiceInfo] = useState<string>("");
    const [sparepartInfo, setSparepartInfo] = useState<string>("");
    const [technicalInfo, setTechnicalInfo] = useState<string>("");
    const [competitorInfo, setCompetitorInfo] = useState<string>("");

    const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
    const [investigations, setInvestigations] = useState<InvestigationItem[]>([]);
    const [units, setUnits] = useState<UnitVisit[]>([]);
    const [unitInvolves, setUnitInvolves] = useState<UnitInvolve[]>([]);

    // UI
    const [showMap, setShowMap] = useState<boolean>(false);

    // State to check if data has been changed
    const [isDataChanged, setIsDataChanged] = useState<boolean>(false);

    // Customer Modal
    const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false)
    const [customers, setCustomers] = useState<any[]>([]);
    const [customerId, setCustomerId] = useState<string>("")


    // Function untuk mendeteksi perubahan input
    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setter(e.target.value);
        setIsDataChanged(true);
    };

    // Fungsi untuk menggabungkan semua data form ke dalam 1 objek
    const getFormData = (custId: string) => ({
        attachments,
        investigations,
        units,
        unitInvolves,
        // Context
        context,
        // General Information
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
        // Basic Information
        customerName,
        dealer,
        dateOperation,
        area,
        location,
        dataLocation, // optional, jika diperlukan
        city,
        segment,
        // Operational
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
        // Customer Voice / Problem Background
        reasonOfPurchase,
        customerInfo,
        serviceInfo,
        sparepartInfo,
        technicalInfo,
        competitorInfo,

        // customer ID
        customerId: custId || ""
    });

    const getCustomerData = () => ({
        units,
        unitInvolves,
        mapAttached,
        mapMarkers,
        mapDistance,
        locationMap,
        customerName,
        dealer,
        dateOperation,
        area,
        location,
        city,
        email: "",
        phone: "",
        segment,
        typeCustomer: "",
        dayPerWeek,
        tripPerDay,
        distancePerTrip,
        routeOfTrip,
    });

    // Fetch list of existing customers
    useEffect(() => {
        if (user) {
            getFromDatabase(`customer/${user.uid}`).then((data) => {
                if (data) {
                    const list = Object.entries(data).map(([key, val]: any) => ({ id: key, ...val }));
                    setCustomers(list);
                }
            });
        }
    }, [user]);

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
                    setLocationMap(data.locationMap || { lat: 0, lng: 0 })

                    // Road Condition
                    setHighway(data.highway || "");
                    setCityRoad(data.cityRoad || "");
                    setCountryRoad(data.countryRoad || "");
                    setOnRoad(data.onRoad || "");
                    setOffRoad(data.offRoad || "");
                    setFlatRoad(data.flatRoad || "");
                    setClimbRoad(data.climbRoad || "");
                    setMaximumSlope(data.maximumSlope || "")
                    setLoadingRatio(data.loadingRatio || "")
                    setYearsOfUse(data.yearsOfUse || "")

                    // Problem Background
                    setReasonOfPurchase(data.reasonOfPurchase || "");
                    setCustomerInfo(data.customerInfo || "");
                    setServiceInfo(data.serviceInfo || "");
                    setSparepartInfo(data.sparepartInfo || "");
                    setTechnicalInfo(data.technicalInfo || "");
                    setCompetitorInfo(data.competitorInfo || "");

                    // Customer ID
                    setCustomerId(data.customerId || "");
                }
            });
        }
    }, [id]);

    // Auto-save ke localStorage setiap data berubah
    useEffect(() => {
        if (isDataChanged) {
            const formData = getFormData(customerId);
            localStorage.setItem("profileVisitDraft", JSON.stringify(formData));
        }
    }, [
        context,
        formNumber,
        visitorName,
        visitDate,
        visitor,
        reviewer,
        approval,
        customerName,
        dealer,
        dateOperation,
        area,
        location,
        dataLocation,
        city,
        segment,
        mapAttached,
        mapMarkers,
        mapDistance,
        locationMap,
        dayPerWeek,
        tripPerDay,
        distancePerTrip,
        routeOfTrip,
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
        reasonOfPurchase,
        customerInfo,
        serviceInfo,
        sparepartInfo,
        technicalInfo,
        competitorInfo,
        attachments,
        investigations,
        units,
        unitInvolves,
        isDataChanged,
        customerId
    ]);

    // Restore data dari localStorage ketika komponen dimount
    useEffect(() => {
        const savedDraft = localStorage.getItem("profileVisitDraft");
        if (savedDraft) {
            const confirmLoad = window.confirm(
                "Terdapat data yang belum tersimpan. Apakah Anda ingin mengembalikannya?"
            );
            if (confirmLoad) {
                const data = JSON.parse(savedDraft);
                // Set state sesuai data yang tersimpan
                setAttachments(data.attachments || []);
                setInvestigations(data.investigations || []);
                setUnits(data.units || []);
                setUnitInvolves(data.unitInvolves || []);

                setContext(data.context || "");
                setFormNumber(data.formNumber || "");
                setVisitorName(data.visitorName || "");
                setVisitDate(data.visitDate || "");
                setVisitor(data.visitor || "");
                setReviewer(data.reviewer || "");
                setApproval(data.approval || "");

                setCustomerName(data.customerName || "");
                setDealer(data.dealer || "");
                setDateOperation(data.dateOperation || "");
                setArea(data.area || "");
                setLocation(data.location || "");
                setDataLocation(data.dataLocation || []);
                setCity(data.city || "");
                setSegment(data.segment || "");

                setMapAttached(data.mapAttached || "");
                setMapMarkers(data.mapMarkers || []);
                setMapDistance(data.mapDistance || 0);
                setLocationMap(data.locationMap || { lat: 0, lng: 0 });

                setDayPerWeek(data.dayPerWeek || "");
                setTripPerDay(data.tripPerDay || "");
                setDistancePerTrip(data.distancePerTrip || "");
                setRouteOfTrip(data.routeOfTrip || "");

                setHighway(data.highway || "");
                setCityRoad(data.cityRoad || "");
                setCountryRoad(data.countryRoad || "");
                setOnRoad(data.onRoad || "");
                setOffRoad(data.offRoad || "");
                setFlatRoad(data.flatRoad || "");
                setClimbRoad(data.climbRoad || "");
                setMaximumSlope(data.maximumSlope || "");
                setLoadingRatio(data.loadingRatio || "");
                setYearsOfUse(data.yearsOfUse || "");

                setReasonOfPurchase(data.reasonOfPurchase || "");
                setCustomerInfo(data.customerInfo || "");
                setServiceInfo(data.serviceInfo || "");
                setSparepartInfo(data.sparepartInfo || "");
                setTechnicalInfo(data.technicalInfo || "");
                setCompetitorInfo(data.competitorInfo || "");

                setCustomerId(data.customerId || "");

                // Setelah restore, anggap data sudah tidak berubah
                setIsDataChanged(false);
            } else {
                localStorage.removeItem("profileVisitDraft");
            }
        }
    }, []);

    const getVisitID = (
        targetId: string
    ): string[] => {
        // cara 1: pakai find, karena id bersifat unik
        const found = customers.find(item => item.id === targetId);
        return found?.visitID ?? [];
    };


    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        // 0) Basic form validation
        if (!customerName || !location) {
            console.log("Some important data is still missing!");
            return;
        }

        // 1) Determine the customer ID
        const customerIdInput = customerId || Date.now().toString();

        // 2) See if it already exists in state
        const idExists = customers.some(c => c.id === customerIdInput);

        // 3) Ask for confirmation
        let confirmed: boolean;
        if (idExists) {
            confirmed = window.confirm(
                `A customer with ID "${customerIdInput}" already exists.\n` +
                `Do you want to UPDATE this customer’s data?`
            );
        } else {
            confirmed = window.confirm(
                `No customer found with ID "${customerIdInput}".\n` +
                `Do you want to CREATE a new customer record?`
            );
        }

        // 4) Bail out if user clicks “Cancel”
        if (!confirmed) {
            console.log(
                idExists
                    ? "User opted NOT to update existing customer."
                    : "User opted NOT to create new customer."
            );
            return;
        }

        // 5) Build the object to save (make sure it includes the chosen ID)
        const newCustomer = {
            id: customerIdInput,
            ...getCustomerData(),
        };

        // 6) Write (or overwrite) to the customer path
        try {
            await saveToDatabase(
                `customer/${user?.uid}/${customerIdInput}`,
                newCustomer
            );
            setIsDataChanged(false);
            localStorage.removeItem("profileCustomerDraft");
            // Optional: toast success here
            navigate("/customer");
        } catch (error) {
            console.error("Error saving customer:", error);
            return;
        }

        // 7) (unchanged) your “visit” save logic
        const newData = getFormData(customerIdInput);
        try {
            const dateNow = Date.now()
            attachments.forEach(data => {
                updateImage(data?.imageId?.toString() ?? "", "uploaded");
            });
            await saveToDatabase(
                `visit/${user?.uid}/${id || dateNow }`,
                newData
            );
            if (customerId) {
                const dataVisitID = getVisitID(customerId)
                if (id) {
                    // check if id exist
                    if (!dataVisitID.includes(id)) {
                        dataVisitID.push(id)
                        await saveToDatabase(`customer/${user?.uid}/${customerId}/visitID`, dataVisitID);
                    }
                }
                else {
                    dataVisitID.push(dateNow.toString())
                    await saveToDatabase(`customer/${user?.uid}/${customerId}/visitID`, dataVisitID);
                }
            }
            setIsDataChanged(false);
            localStorage.removeItem("profileVisitDraft");
            navigate("/visit");
        } catch (error) {
            console.error("Error saving visit:", error);
        }
    };


    // Mengatur beforeunload dan back button untuk memberi peringatan jika ada perubahan data
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDataChanged) {
                event.preventDefault();
                event.returnValue = "You have unsaved changes. Are you sure you want to leave?";
            }
        };

        const handleBackButton = () => {
            if (isDataChanged) {
                const confirmLeave = window.confirm(
                    "You have unsaved changes. Are you sure you want to leave this page?"
                );
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

    // Handler when choosing a customer from modal
    const handleSelectCustomer = (cust: any) => {
        setUnits(cust.units || [])
        setUnitInvolves(cust.unitInvolves || [])
        setCustomerName(cust.customerName || "");
        setDealer(cust.dealer || "");
        setDateOperation(cust.dateOperation || "");
        setArea(cust.area || "");
        setDataLocation(areaMap[cust.area] || []);
        setLocation(cust.location || "");
        setCity(cust.city || "");
        setSegment(cust.segment || "");
        setDayPerWeek(cust.dayPerWeek || "");
        setTripPerDay(cust.tripPerDay || "");
        setDistancePerTrip(cust.distancePerTrip || "");
        setRouteOfTrip(cust.routeOfTrip || "");
        setMapAttached(cust.mapAttached || "");
        setMapMarkers(cust.mapMarkers || []);
        setMapDistance(cust.mapDistance || 0);
        setLocationMap(cust.locationMap || { lat: 0, lng: 0 });
        setIsDataChanged(true);
        setShowCustomerModal(false);
        setCustomerId(cust.id)
    };


    return (
        <div className="App overflow-x-hidden">

            {showCustomerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-3/4 max-w-lg p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Pilih Customer yang Sudah Ada</h3>
                        <ul className="max-h-60 overflow-y-auto">
                            {customers.map((c) => (
                                <li
                                    key={c.id}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleSelectCustomer(c)}
                                >
                                    {c.customerName}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded-full"
                                onClick={() => setShowCustomerModal(false)}
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="pt-16">
                <form
                    className="md:w-10/12 w-11/12 flex flex-col mx-auto my-8 justify-around items-center"
                    onSubmit={handleSendData}
                >
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
                            <InputField
                                required={true}
                                label="Visitor Name"
                                name="visitorName"
                                value={visitorName}
                                onChange={handleChange(setVisitorName)}
                                placeholder="Enter visitor name"
                            />
                            <InputField
                                required={true}
                                label="Visit Date"
                                name="visitDate"
                                type="date"
                                value={visitDate}
                                onChange={handleChange(setVisitDate)}
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
                        <div className="w-full gap-5 flex items-center justify-between">
                            <h2 className="font-semibold">Basic Information</h2>
                            <button
                                type="button"
                                className="px-4 py-2 bg-primary text-white rounded-full font-semibold"
                                onClick={() => setShowCustomerModal(true)}
                            >
                                Select Customer
                            </button>
                        </div>
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
                            <InputField
                                label="Operation Date"
                                name="dateOperation"
                                type="date"
                                value={dateOperation}
                                onChange={handleChange(setDateOperation)}
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
                                label="Segment"
                                name="segment"
                                value={segment}
                                onChange={handleChange(setSegment)}
                                options={segmentData}
                            />
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
                            <InputField
                                label="Days per Week"
                                type="number"
                                name="dayPerWeek"
                                value={dayPerWeek}
                                onChange={handleChange(setDayPerWeek)}
                                placeholder="Enter number of working days"
                            />
                            <InputField
                                label="Trips per Day"
                                type="number"
                                name="tripPerDay"
                                value={tripPerDay}
                                onChange={handleChange(setTripPerDay)}
                                placeholder="Enter number of trips per day"
                            />
                            <InputField
                                label="Distance per Trip"
                                type="number"
                                name="distancePerTrip"
                                value={distancePerTrip}
                                onChange={handleChange(setDistancePerTrip)}
                                placeholder="Enter distance per trip"
                            />
                        </div>
                        <InputField
                            label="Route of Trip"
                            type="string"
                            name="routeOfTrip"
                            value={routeOfTrip}
                            onChange={handleChange(setRouteOfTrip)}
                            placeholder="Enter trip route"
                        />
                    </div>

                    {/* Map Operation */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold mb-4">Map Operation</h2>
                        <div className="relative w-full flex justify-center -mb-12 z-10">
                            <button
                                className={`mt-4 px-6 py-2 justify-center items-center bg-primary rounded-full text-white font-semibold ${showMap ? "hidden" : "inline-flex"
                                    }`}
                                onClick={() => setShowMap(true)}
                                type="button"
                            >
                                Add Point
                            </button>
                        </div>
                        <MapDistance
                            setLocationMap={setLocationMap}
                            locationMap={locationMap || { lat: 0, lng: 0 }}
                            setMarkers={setMapMarkers}
                            markers={mapMarkers}
                            setDistance={setMapDistance}
                            distance={mapDistance ?? 0}
                            setShow={setShowMap}
                            show={showMap}
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
                                placeholder="Enter highway condition"
                            />
                            <InputField
                                label="City Road (%)"
                                type="number"
                                name="cityRoad"
                                value={cityRoad}
                                onChange={handleChange(setCityRoad)}
                                placeholder="Enter city road condition"
                            />
                            <InputField
                                label="Rural Road (%)"
                                type="number"
                                name="countryRoad"
                                value={countryRoad}
                                onChange={handleChange(setCountryRoad)}
                                placeholder="Enter rural road condition"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                label="On Road (%)"
                                type="number"
                                name="onRoad"
                                value={onRoad}
                                onChange={handleChange(setOnRoad)}
                                placeholder="Enter paved road condition"
                            />
                            <InputField
                                label="Off-Road (%)"
                                type="number"
                                name="offRoad"
                                value={offRoad}
                                onChange={handleChange(setOffRoad)}
                                placeholder="Enter off-road condition"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                label="Flat Road (%)"
                                type="number"
                                name="flatRoad"
                                value={flatRoad}
                                onChange={handleChange(setFlatRoad)}
                                placeholder="Enter flat road condition"
                            />
                            <InputField
                                label="Uphill Road (%)"
                                type="number"
                                name="climbRoad"
                                value={climbRoad}
                                onChange={handleChange(setClimbRoad)}
                                placeholder="Enter uphill road condition"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                label="Maximum Slope (%)"
                                type="number"
                                name="maximumSlope"
                                value={maximumSlope}
                                onChange={handleChange(setMaximumSlope)}
                                placeholder="Maximum slope"
                            />
                            <InputField
                                label="Loading Ratio (%)"
                                type="number"
                                name="loadingRatio"
                                value={loadingRatio}
                                onChange={handleChange(setLoadingRatio)}
                                placeholder="Enter loading ratio"
                            />
                            <InputField
                                label="Years of Use"
                                type="number"
                                name="yearsOfUse"
                                value={yearsOfUse}
                                onChange={handleChange(setYearsOfUse)}
                                placeholder="Enter years of use"
                            />
                        </div>
                    </div>

                    {/* Customer POV */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Customer POV</h2>
                        <TextField
                            label="Reason of Purchase"
                            name="reasonOfPurchase"
                            value={reasonOfPurchase}
                            onChange={handleChange(setReasonOfPurchase)}
                            placeholder="Reason for purchasing the unit"
                        />
                        <TextField
                            label="Customer Information"
                            name="customerInfo"
                            value={customerInfo}
                            onChange={handleChange(setCustomerInfo)}
                            placeholder="Enter customer information"
                        />
                        <TextField
                            label="Service Information"
                            name="serviceInfo"
                            value={serviceInfo}
                            onChange={handleChange(setServiceInfo)}
                            placeholder="Enter service information"
                        />
                        <TextField
                            label="Spare Parts Information"
                            name="sparepartInformation"
                            value={sparepartInfo}
                            onChange={handleChange(setSparepartInfo)}
                            placeholder="Enter spare parts information"
                        />
                        <TextField
                            label="Technical Information"
                            name="technicalInfo"
                            value={technicalInfo}
                            onChange={handleChange(setTechnicalInfo)}
                            placeholder="Enter technical information"
                        />
                        <TextField
                            label="Competitor Information"
                            name="competitorInfo"
                            value={competitorInfo}
                            onChange={handleChange(setCompetitorInfo)}
                            placeholder="Enter competitor information"
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

export default ProfileVisitEditor;
