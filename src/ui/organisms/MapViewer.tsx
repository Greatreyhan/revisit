import React, { useRef, useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from "@react-google-maps/api";
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

interface MapViewerProps {
  locationMap: MapMarkerData | null;
  markers: MapMarkerData[];
  distance: number;
  show: boolean;
}

const MapViewer: React.FC<MapViewerProps> = ({ locationMap, markers, distance, show }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  // Menghitung rute dan jarak jika terdapat dua marker
  useEffect(() => {
    if (
      markers.length >= 2 &&
      markers[0] &&
      markers[1] &&
      typeof window.google !== "undefined"
    ) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: markers[0],
          destination: markers[1],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error("Error fetching directions", result);
          }
        }
      );
    } else {
      setDirections(null);
    }
  }, [markers]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className={`${show ? "flex flex-col fixed" : "h-60"} top-0 relative left-0 items-center w-full h-screen z-40`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
        {locationMap && (
          <Marker
            key={`location-map-${locationMap.lat}-${locationMap.lng}`}
            position={locationMap}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      <div className="-mt-8 z-10 absolute w-full flex justify-center">
        <p className="bg-white px-6 py-1 text-md border-t border-x font-semibold">
          Distance : {markers[0] && markers[1] ? (distance / 1000).toFixed(2) : ""} km
        </p>
      </div>
    </div>
  );
};

export default MapViewer;
