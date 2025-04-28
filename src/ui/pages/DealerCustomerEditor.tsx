import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFirebase } from "../../utils/FirebaseContext";
import SelectInput from "../molecules/SelectInput";
import InputField from "../molecules/InputField";
import { areaData, areaMap, DealerData, segmentData } from "../../utils/masterData";
import { UnitInvolve } from "../interface/Report";
import { UnitVisit } from "../interface/Visit";
import AddUnitVisit from "../organisms/AddUnitVisit";
import { MapMarkerData } from "../interface/MapSelector";
import MapDistance from "../organisms/MapDistance";

const DealerCustomerEditor: React.FC = () => {
    const { saveToDatabase, getFromDatabase } = useFirebase();
    const navigate = useNavigate();
    const { uid,id } = useParams<{ uid:string, id: string }>();

    // Basic Information
    const [customerName, setCustomerName] = useState<string>("");
    const [dealer, setDealer] = useState<string>("");
    const [dateOperation, setDateOperation] = useState<string>("");
    const [area, setArea] = useState<string>("");
    const [dataLocation, setDataLocation] = useState<string[]>([]);
    const [location, setLocation] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [segment, setSegment] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [typeCustomer, setTypeCustomer] = useState<string>("");

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

    const [units, setUnits] = useState<UnitVisit[]>([]);
    const [unitInvolves, setUnitInvolves] = useState<UnitInvolve[]>([]);

    // UI
    const [showMap, setShowMap] = useState<boolean>(false);

    // State to check if data has been changed
    const [isDataChanged, setIsDataChanged] = useState<boolean>(false);

    // Function untuk mendeteksi perubahan input
    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setter(e.target.value);
        setIsDataChanged(true);
    };

    // Fungsi untuk menggabungkan semua data form ke dalam 1 objek
    const getFormData = () => ({
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
        email,
        phone,
        segment,
        typeCustomer,
        dayPerWeek,
        tripPerDay,
        distancePerTrip,
        routeOfTrip,
    });

    useEffect(() => {
        if (id) {
            getFromDatabase(`customer/${uid}/${id}`).then((data) => {
                if (data) {
                    setUnits(data.units || [])
                    setUnitInvolves(data.unitInvolves || [])

                    // Vehicle Information
                    setCustomerName(data.customerName || "");
                    setArea(data.area || "");
                    setLocation(data.location || "");
                    setCity(data.city || "");
                    setDealer(data.dealer || "");
                    setEmail(data.email || "");
                    setPhone(data.phone || "");
                    setSegment(data.segment || "");
                    setTypeCustomer(data.typeCustomer || "");
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

                }
            });
        }
    }, [id]);

    // Auto-save ke localStorage setiap data berubah
    useEffect(() => {
        if (isDataChanged) {
            const formData = getFormData();
            localStorage.setItem("profileCustomerDraft", JSON.stringify(formData));
        }
    }, [
        customerName,
        dealer,
        dateOperation,
        area,
        location,
        dataLocation,
        city,
        email,
        phone,
        segment,
        typeCustomer,
        mapAttached,
        mapMarkers,
        mapDistance,
        locationMap,
        dayPerWeek,
        tripPerDay,
        distancePerTrip,
        routeOfTrip,
        units,
        unitInvolves,
        isDataChanged,
    ]);

    // Restore data dari localStorage ketika komponen dimount
    useEffect(() => {
        const savedDraft = localStorage.getItem("profileCustomerDraft");
        if (savedDraft) {
            const confirmLoad = window.confirm(
                "Terdapat data yang belum tersimpan. Apakah Anda ingin mengembalikannya?"
            );
            if (confirmLoad) {
                const data = JSON.parse(savedDraft);
                setUnits(data.units || []);
                setUnitInvolves(data.unitInvolves || []);

                setCustomerName(data.customerName || "");
                setDealer(data.dealer || "");
                setDateOperation(data.dateOperation || "");
                setArea(data.area || "");
                setLocation(data.location || "");
                setDataLocation(data.dataLocation || []);
                setCity(data.city || "");
                setEmail(data.email || "");
                setPhone(data.phone || "");
                setSegment(data.segment || "");
                setTypeCustomer(data.typeCustomer || "");

                setMapAttached(data.mapAttached || "");
                setMapMarkers(data.mapMarkers || []);
                setMapDistance(data.mapDistance || 0);
                setLocationMap(data.locationMap || { lat: 0, lng: 0 });

                setDayPerWeek(data.dayPerWeek || "");
                setTripPerDay(data.tripPerDay || "");
                setDistancePerTrip(data.distancePerTrip || "");
                setRouteOfTrip(data.routeOfTrip || "");

                // Setelah restore, anggap data sudah tidak berubah
                setIsDataChanged(false);
            } else {
                localStorage.removeItem("profileCustomerDraft");
            }
        }
    }, []);

    const handleSendData = async (e: React.FormEvent) => {
        e.preventDefault();

        // Minimal validation; bisa dikembangkan lebih lanjut
        if (!customerName || !location) {
            console.log("Some important data is still missing!");
            return;
        }

        const newData = getFormData();

        try {
            await saveToDatabase(`customer/${uid}/${id || Date.now()}`, newData);
            setIsDataChanged(false);
            // Hapus draft setelah data berhasil dikirim
            localStorage.removeItem("profileCustomerDraft");
            navigate("/customer");
        } catch (error) {
            console.error("Error saving data:", error);
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

    return (
        <div className="App overflow-x-hidden">
            <div className="pt-16">
                <form
                    className="md:w-10/12 w-11/12 flex flex-col mx-auto my-8 justify-around items-center"
                    onSubmit={handleSendData}
                >

                    {/* Basic Information */}
                    <div className="w-full py-8 px-8 rounded-lg my-4 bg-slate-100">
                        <h2 className="font-semibold">Customer Information</h2>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                required={true}
                                disabled={true}
                                label="Customer Name"
                                name="customerName"
                                value={customerName}
                                onChange={handleChange(setCustomerName)}
                                placeholder="Enter customer name"
                            />
                            <SelectInput
                                required={true}
                                disabled={true}
                                label="Dealer"
                                name="dealer"
                                value={dealer}
                                onChange={handleChange(setDealer)}
                                options={DealerData}
                            />
                            <InputField
                                disabled={true}
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
                                disabled={true}
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
                                disabled={true}
                                label="Location"
                                name="location"
                                value={location}
                                onChange={handleChange(setLocation)}
                                options={dataLocation}
                            />
                            <InputField
                                required={true}
                                disabled={true}
                                label="City"
                                name="city"
                                value={city}
                                onChange={handleChange(setCity)}
                                placeholder="Enter city"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <InputField
                                required={true}
                                disabled={true}
                                label="Email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleChange(setEmail)}
                                placeholder="Enter Email"
                            />
                            <InputField
                                required={true}
                                disabled={true}
                                label="Phone"
                                name="phone"
                                type="phone"
                                value={phone}
                                onChange={handleChange(setPhone)}
                                placeholder="Enter Phone"
                            />
                        </div>
                        <div className="md:flex w-full gap-5">
                            <SelectInput
                                required={true}
                                disabled={true}
                                label="Segment"
                                name="segment"
                                value={segment}
                                onChange={handleChange(setSegment)}
                                options={segmentData}
                            />
                            <SelectInput
                                required={true}
                                disabled={true}
                                label="Type Customer"
                                name="typeCustomer"
                                value={typeCustomer}
                                onChange={handleChange(setTypeCustomer)}
                                options={["Premium", "Non-Premium"]}
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
                                disabled={true}
                                label="Days per Week"
                                type="number"
                                name="dayPerWeek"
                                value={dayPerWeek}
                                onChange={handleChange(setDayPerWeek)}
                                placeholder="Enter number of working days"
                            />
                            <InputField
                                disabled={true}
                                label="Trips per Day"
                                type="number"
                                name="tripPerDay"
                                value={tripPerDay}
                                onChange={handleChange(setTripPerDay)}
                                placeholder="Enter number of trips per day"
                            />
                            <InputField
                                disabled={true}
                                label="Distance per Trip"
                                type="number"
                                name="distancePerTrip"
                                value={distancePerTrip}
                                onChange={handleChange(setDistancePerTrip)}
                                placeholder="Enter distance per trip"
                            />
                        </div>
                        <InputField
                            disabled={true}
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
                        {/* <div className="relative w-full flex justify-center -mb-12 z-10">
                            <button
                                className={`mt-4 px-6 py-2 justify-center items-center bg-primary rounded-full text-white font-semibold ${
                                    showMap ? "hidden" : "inline-flex"
                                }`}
                                onClick={() => setShowMap(true)}
                                type="button"
                            >
                                Add Point
                            </button>
                        </div> */}
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

                    <div className="flex w-full justify-end items-center gap-x-5">
                        <Link
                            className="mt-4 px-6 py-2 inline-flex justify-center items-center bg-white text-primary border border-primary rounded-full font-semibold"
                            to="/dealer/customer"
                        >
                            Back
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DealerCustomerEditor;
