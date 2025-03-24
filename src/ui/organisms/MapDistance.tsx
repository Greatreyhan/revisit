import React, { useCallback, useRef, useState } from "react";
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import type { GoogleMap as GoogleMapType } from "@react-google-maps/api";
import { MapMarkerData } from "../interface/MapSelector";

const libraries: ("places" | "drawing" | "geometry")[] = ["places", "geometry"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -6.200000,
  lng: 106.816666,
};

interface MapDistanceProps {
  setLocationMap: (location: MapMarkerData) => void;
  locationMap: MapMarkerData | null;
  setMarkers: (markers: MapMarkerData[]) => void;
  markers: MapMarkerData[];
  setDistance: (dist: number | null) => void;
  distance: number;
  show: boolean;
  setShow: (display: boolean) => void;
}

const MapDistance: React.FC<MapDistanceProps> = ({
  setLocationMap,
  locationMap,
  setMarkers,
  markers,
  setDistance,
  distance,
  setShow,
  show,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // Perluas tipe activeSelection untuk mencakup "location"
  const [activeSelection, setActiveSelection] = useState<"start" | "end" | "locationMap" | null>(null);

  // Satu ref autocomplete untuk ketiga keperluan
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<GoogleMapType | null>(null);

  // Penanganan klik pada peta, aktif bila mode pemilihan diaktifkan
  const onMapClick = useCallback((event: any) => {
    if (!activeSelection) return;
    const latLng = event.latLng;
    if (!latLng) return;

    const newPoint: MapMarkerData = { lat: latLng.lat(), lng: latLng.lng() };

    if (activeSelection === "start") {
      const newMarkers = [...markers];
      newMarkers[0] = newPoint;
      setMarkers(newMarkers);
    } else if (activeSelection === "end") {
      const newMarkers = [...markers];
      newMarkers[1] = newPoint;
      setMarkers(newMarkers);
    } else if (activeSelection === "locationMap") {
      setLocationMap(newPoint);
    }
    setDistance(null);
    setActiveSelection(null);
  }, [activeSelection, markers, setMarkers, setLocationMap, setDistance]);

  const calculateDistance = () => {
    if (markers.length < 2 || !markers[0] || !markers[1]) return;
    const pointA = new window.google.maps.LatLng(markers[0].lat, markers[0].lng);
    const pointB = new window.google.maps.LatLng(markers[1].lat, markers[1].lng);
    const distanceMeters = window.google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);

    setDistance(distanceMeters);
    setShow(false);
  };

  // Fungsi yang dipanggil saat terjadi perubahan pada Autocomplete
  const onPlaceSelected = () => {
    if (!autocompleteRef.current || !activeSelection) return;
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry?.location) {
      const selectedPoint: MapMarkerData = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      if (activeSelection === "start") {
        const newMarkers = [...markers];
        newMarkers[0] = selectedPoint;
        setMarkers(newMarkers);
      } else if (activeSelection === "end") {
        const newMarkers = [...markers];
        newMarkers[1] = selectedPoint;
        setMarkers(newMarkers);
      } else if (activeSelection === "locationMap") {
        setLocationMap(selectedPoint);
      }
      mapRef.current?.panTo(selectedPoint);
      setActiveSelection(null);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className={`${show ? "flex flex-col fixed" : "h-60"} top-0 left-0 items-center w-full h-screen`}>
      <div className="fixed px-4 z-50 flex flex-col space-y-3 py-2 md:w-8/12 w-full bg-white bg-opacity-50 backdrop-blur-lg rounded-b-lg">
        {/* Tombol untuk mengaktifkan mode pemilihan */}
        <div className="flex justify-between">
          <div className="flex gap-3">
            <button
              className={`px-4 py-1 text-sm ${activeSelection === "start" ? "bg-primary-dark" : "bg-primary"} text-white rounded hover:bg-primary-dark`}
              onClick={() => setActiveSelection("start")}
              type="button"
            >
              Set Start
            </button>
            <button
              className={`px-4 py-1 text-sm ${activeSelection === "end" ? "bg-primary-dark" : "bg-primary"} text-white rounded hover:bg-primary-dark`}
              onClick={() => setActiveSelection("end")}
              type="button"
            >
              Set End
            </button>
            <button
              className={`px-4 py-1 text-sm ${activeSelection === "locationMap" ? "bg-primary-dark" : "bg-primary"} text-white rounded hover:bg-primary-dark`}
              onClick={() => setActiveSelection("locationMap")}
              type="button"
            >
              Set Location
            </button>
          </div>
          <div className="flex items-center justify-around space-x-4">
            <div className="md:flex-row flex-col flex gap-3">
              <button
                className="px-6 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-dark cursor-pointer"
                onClick={() => setShow(false)}
                type="button"
              >
                Kembali
              </button>
              <button
                className="px-6 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-dark cursor-pointer"
                type="button"
                onClick={calculateDistance}
              >
                Pilih
              </button>
            </div>
          </div>
        </div>

        {/* Satu komponen Autocomplete untuk ketiga keperluan */}
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={onPlaceSelected}
        >
          <div className="flex flex-col w-full">
            <label className="md:text-sm text-xs font-semibold my-1 text-gray-700">
              {activeSelection === "start"
                ? "Titik Awal"
                : activeSelection === "end"
                  ? "Titik Akhir"
                  : activeSelection === "locationMap"
                    ? "Lokasi"
                    : "Pilih Lokasi"}
            </label>
            <input
              disabled={!activeSelection}
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary-light focus:rounded-lg focus:border-transparent"
              type="text"
              placeholder={
                activeSelection === "start"
                  ? "Titik Awal"
                  : activeSelection === "end"
                    ? "Titik Akhir"
                    : activeSelection === "locationMap"
                      ? "Lokasi"
                      : "Pilih Lokasi"
              }
            />
          </div>
        </Autocomplete>

      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        onClick={onMapClick}
        onLoad={(map) => (mapRef.current = map)}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
        {locationMap && (
          <Marker
            key={`location-map-${locationMap.lat}-${locationMap.lng}`}
            position={locationMap}
          />
        )}      </GoogleMap>
      <div className="-mt-8 z-10">
        <p className="bg-white px-6 py-1 text-md border-t border-x font-semibold">
          Distance : {markers[0] && markers[1] ? (distance / 1000).toFixed(2) : ""} km
        </p>
      </div>
    </div>
  );
};

export default MapDistance;
