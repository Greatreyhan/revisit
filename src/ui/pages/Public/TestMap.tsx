import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
const libraries: ("places" | "drawing" | "geometry")[] = ["geometry"]; // Mengaktifkan library geometry untuk perhitungan jarak

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: -6.200000,
  lng: 106.816666,
};

interface LatLng {
  lat: number;
  lng: number;
}

const TestMap: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [markers, setMarkers] = useState<LatLng[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  // Fungsi untuk menangani klik pada peta
  const onMapClick = useCallback((event: any) => {
    // Jika sudah ada dua marker, reset untuk titik baru
    if (markers.length >= 2) {
      setMarkers([
        {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
      ]);
      setDistance(null);
    } else {
      setMarkers((current) => [
        ...current,
        {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
      ]);
    }
  }, [markers]);

  // Fungsi untuk menghitung jarak antara dua titik menggunakan computeDistanceBetween
  const calculateDistance = () => {
    if (markers.length < 2) return;
    const pointA = new window.google.maps.LatLng(markers[0].lat, markers[0].lng);
    const pointB = new window.google.maps.LatLng(markers[1].lat, markers[1].lng);
    const distanceMeters = window.google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);
    setDistance(distanceMeters);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div className="flex flex-col items-center w-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        onClick={onMapClick}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </GoogleMap>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={calculateDistance}
        disabled={markers.length < 2}
      >
        Hitung Jarak
      </button>
      {distance !== null && (
        <div className="mt-2">
          Jarak: {distance.toFixed(2)} meter
        </div>
      )}
    </div>
  );
};

export default TestMap;
