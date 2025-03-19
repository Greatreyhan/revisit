import React, { useState, useRef } from "react";
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import type { GoogleMap as GoogleMapType } from "@react-google-maps/api";

const libraries: ("places" | "drawing" | "geometry")[] = ["places"]; // Mengaktifkan library places untuk pencarian

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

const MapSelector: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDy_z3fG3Rb-WyX79DazneEBw5sqjpWy-s",
    libraries,
  });

  const [marker, setMarker] = useState<LatLng | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<GoogleMapType | null>(null);

  // Fungsi untuk menangani klik pada peta
  const onMapClick = (event: any) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  // Fungsi untuk menangani pemilihan lokasi dari input pencarian
  const onPlaceSelected = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const location = {
          lat: place?.geometry?.location?.lat() || 0,
          lng: place?.geometry?.location?.lng() || 0,
        };
        setMarker(location);
        mapRef.current?.panTo(location);
      }
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="flex flex-col items-center w-full">
      <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={onPlaceSelected}>
        <input
          type="text"
          placeholder="Pilih Lokasi"
          className="px-4 py-2 border rounded w-full mb-4"
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={marker || center}
        onClick={onMapClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
};

export default MapSelector;