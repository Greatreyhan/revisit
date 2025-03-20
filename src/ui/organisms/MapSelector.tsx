import React, { useCallback, useRef } from "react";
import { GoogleMap, Marker, useLoadScript, Autocomplete } from "@react-google-maps/api";
import type { GoogleMap as GoogleMapType } from "@react-google-maps/api";
import { MapMarkerData } from "../interface/MapSelector";

const libraries: ("places" | "drawing" | "geometry")[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -6.200000,
  lng: 106.816666,
};

interface MapSelectorProps {
  setMarkers: (marker: MapMarkerData[]) => void;
  markers: MapMarkerData[];
  show: boolean;
  setShow: (display: boolean) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ setMarkers, markers, setShow, show }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDy_z3fG3Rb-WyX79DazneEBw5sqjpWy-s",
    libraries,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<GoogleMapType | null>(null);

  const onMapClick = useCallback((event: any) => {
    const latLng = event.latLng;
    if (!latLng) return;

    const newMarker: MapMarkerData = { lat: latLng.lat(), lng: latLng.lng() };

    setMarkers([newMarker]); // Hanya menyimpan satu titik
  }, [setMarkers]);

  const onPlaceSelected = () => {
    const autocomplete = autocompleteRef.current as unknown as google.maps.places.Autocomplete;
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (place?.geometry?.location) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      setMarkers([location]);
      mapRef.current?.panTo(location);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className={`${show ? "flex flex-col fixed" : "h-60"} top-0 left-0 items-center w-full h-screen`}>
      <div className="fixed px-4 z-50 flex items-center justify-around space-x-4 py-2 md:w-5/12 w-full bg-white bg-opacity-50 backdrop-blur-lg rounded-b-lg">

        <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={onPlaceSelected}>
          <div className="flex items-center w-full">
            <input
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary-light focus:rounded-lg focus:border-transparent"
              type="text"
              placeholder="Cari lokasi..."
            />
          </div>
        </Autocomplete>

        <div className={` ${show ? "flex" : "hidden"} md:flex-row flex-col gap-3`}>
          <button
            className="px-6 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary-dark cursor-pointer"
            type="button"
            onClick={() => setShow(false)}
          >
            Pilih
          </button>
        </div>

      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        onClick={onMapClick}
        onLoad={(map) => {
          mapRef.current = map as unknown as GoogleMapType; // Cast agar sesuai dengan tipe GoogleMapType
        }}
      >
        {markers.map((mark, index) => (
          <Marker key={index} position={mark} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapSelector;
