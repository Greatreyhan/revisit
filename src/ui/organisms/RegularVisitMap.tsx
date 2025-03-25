import { useEffect, useState } from "react";
import { 
  GoogleMap, 
  Marker, 
  DirectionsRenderer, 
  useLoadScript 
} from '@react-google-maps/api';
import Loading from "../molecules/Loading";
import { Link } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";
import { VisitData } from "../interface/Visit";

const center = {
  lat: -6.200000,
  lng: 106.816666,
};

const containerStyle = {
  width: '100%',
  height: '100%',
};

interface RegularVisitMapProps {
  visitReports: VisitData[];
  setVisitReports: (visitData: VisitData[]) => void;
}

const RegularVisitMap: React.FC<RegularVisitMapProps> = ({ visitReports }) => {
  const [selectedData, setSelectedData] = useState<VisitData>();
  const [filterType, setFilterType] = useState("all");
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [maxSlope, setMaxSlope] = useState<number | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ['geometry'],
  });

  useEffect(() => {
    console.log(visitReports);
  }, [visitReports]);

  if (!isLoaded) {
    return <Loading />;
  }

  const handleSelect = (type: string) => {
    setFilterType(type);
  };

  // Fungsi untuk menghitung maximum slope menggunakan Elevation API
  const computeMaxSlope = (directionsResult: google.maps.DirectionsResult) => {
    const route = directionsResult.routes[0];
    if (!route.overview_path) return;
    const path = route.overview_path;
    const elevator = new google.maps.ElevationService();
    elevator.getElevationAlongPath(
      {
        path: path,
        samples: 256, // jumlah sampel, bisa disesuaikan
      },
      (results, status) => {
        if (status === google.maps.ElevationStatus.OK && results) {
          let currentMaxSlope = 0;
          for (let i = 1; i < results.length; i++) {
            const prevLocation = results[i - 1].location;
            const currLocation = results[i].location;
            // Pastikan kedua lokasi tidak null
            if (!prevLocation || !currLocation) continue;

            const elevationDiff = results[i].elevation - results[i - 1].elevation;
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
              currLocation,
              prevLocation
            );
            if (distance > 0) {
              const slopePercent = (elevationDiff / distance) * 100;
              if (Math.abs(slopePercent) > currentMaxSlope) {
                currentMaxSlope = Math.abs(slopePercent);
              }
            }
          }
          setMaxSlope(currentMaxSlope);
        } else {
          console.error("Elevation API error", status);
        }
      }
    );
  };

  // Saat marker diklik, ambil data, tampilkan rute dan hitung maximum slope
  const handleMarkerClick = (data: VisitData) => {
    setSelectedData(data);
    setDirections(null);
    setMaxSlope(null);
    if (data.mapMarkers && data.mapMarkers.length >= 2) {
      const origin = data.mapMarkers[0];
      const destination = data.mapMarkers[data.mapMarkers.length - 1];
      const waypoints =
        data.mapMarkers.length > 2
          ? data.mapMarkers.slice(1, data.mapMarkers.length - 1).map(marker => ({
              location: marker,
              stopover: true,
            }))
          : [];
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            computeMaxSlope(result);
          } else {
            console.error("Error fetching directions", result);
          }
        }
      );
    }
  };

  const totalIsuzu =
    selectedData && selectedData.units
      ? selectedData.units
          .filter(unit => unit.trademark.toUpperCase() === "ISUZU")
          .reduce((acc, curr) => acc + parseInt(curr.qtyUnit), 0)
      : 0;

  const totalNonIsuzu =
    selectedData && selectedData.units
      ? selectedData.units
          .filter(unit => unit.trademark.toUpperCase() !== "ISUZU")
          .reduce((acc, curr) => acc + parseInt(curr.qtyUnit), 0)
      : 0;

  return (
    <div className="flex fixed left-0 top-0 w-screen h-screen">
      <div className="flex fixed z-50 top-3 w-full justify-center ">
        <Link
          to="/admin/visit"
          className="px-6 py-2 flex justify-center items-center mx-4 rounded-full border-r bg-white backdrop-blur-lg text-black"
        >
          <IoMdReturnLeft />
        </Link>
        {/* Tombol filter */}
        <button
          className={`px-6 py-2 rounded-l-full border-r ${
            filterType === "isuzu"
              ? "bg-slate-200 backdrop-blur-lg bg-opacity-50 text-black"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("isuzu")}
        >
          ISUZU
        </button>
        <button
          className={`px-6 py-2 border-r ${
            filterType === "non-isuzu"
              ? "bg-slate-200 backdrop-blur-lg bg-opacity-50 text-black"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("non-isuzu")}
        >
          NON-ISUZU
        </button>
        <button
          className={`px-6 py-2 rounded-r-full ${
            filterType === "all"
              ? "bg-slate-200 backdrop-blur-lg bg-opacity-50 text-black"
              : "bg-white text-black"
          }`}
          onClick={() => handleSelect("all")}
        >
          ALL
        </button>
      </div>
      <div
        className={`${
          selectedData ? "block" : "hidden"
        } fixed bottom-2 left-2 shadow-xl z-10 bg-white px-8 py-6 rounded-tr`}
      >
        <table className="text-sm mt-2">
          <tbody className="w-full">
            <tr className="text-left w-full">
              <td className="font-semibold">Dealer</td>
              <td className="pl-8">{selectedData?.dealer}</td>
            </tr>
            <tr className="text-left w-full">
              <td className="font-semibold">Customer</td>
              <td className="pl-8">{selectedData?.customerName}</td>
            </tr>
            <tr className="text-left w-full">
              <td className="font-semibold">Segment</td>
              <td className="pl-8">{selectedData?.segment}</td>
            </tr>
            <tr className="text-left w-full">
              <td className="font-semibold">Operation</td>
              <td className="pl-8">{selectedData?.dateOperation}</td>
            </tr>
            <tr className="text-left w-full">
              <td className="font-semibold">Distance</td>
              <td className="pl-8">
                {((selectedData?.mapDistance || 0) / 1000).toFixed(2)} Km
              </td>
            </tr>
            <tr className="text-left w-full">
              <td className="font-semibold">Last Visit</td>
              <td className="pl-8">{selectedData?.visitDate}</td>
            </tr>
            {selectedData && selectedData.units && (
              <>
                <tr className="text-left w-full">
                  <td className="font-semibold">Unit ISUZU</td>
                  <td className="pl-8">{totalIsuzu}</td>
                </tr>
                <tr className="text-left w-full">
                  <td className="font-semibold">Unit Non-Isuzu</td>
                  <td className="pl-8">{totalNonIsuzu}</td>
                </tr>
              </>
            )}
            {maxSlope !== null && (
              <tr className="text-left w-full">
                <td className="font-semibold">Max Slope</td>
                <td className="pl-8">{maxSlope.toFixed(2)}%</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="w-full h-full items-center">
        <GoogleMap mapContainerStyle={containerStyle} zoom={8} center={center}>
          {visitReports.map((data, index) => {
            let totalUnits = 0;
            if (data.units) {
              if (filterType === "isuzu") {
                totalUnits = data.units
                  .filter(unit => unit.trademark.toUpperCase() === "ISUZU")
                  .reduce((acc, curr) => acc + parseInt(curr.qtyUnit), 0);
              } else if (filterType === "non-isuzu") {
                totalUnits = data.units
                  .filter(unit => unit.trademark.toUpperCase() !== "ISUZU")
                  .reduce((acc, curr) => acc + parseInt(curr.qtyUnit), 0);
              } else {
                totalUnits = data.units.reduce(
                  (acc, curr) => acc + parseInt(curr.qtyUnit),
                  0
                );
              }
            }
            return (
              <Marker
                key={index}
                position={data.locationMap}
                label={{
                  text: `${totalUnits}`,
                  color: "black",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                onClick={() => handleMarkerClick(data)}
              />
            );
          })}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default RegularVisitMap;
