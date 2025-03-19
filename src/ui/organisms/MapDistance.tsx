import React, { useCallback, useRef } from "react";
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
  setMarkers: (markers: MapMarkerData[]) => void;
  markers: MapMarkerData[];
  setDistance: (dist: number | null) => void;
  distance: number | null;
  show: boolean;
  setShow: (display: boolean) => void;
}

const MapDistance: React.FC<MapDistanceProps> = ({ setMarkers, markers, setDistance, distance, setShow, show }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDy_z3fG3Rb-WyX79DazneEBw5sqjpWy-s",
    libraries,
  });

  const startAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const endAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<GoogleMapType | null>(null);

  const onMapClick = useCallback((event: any) => {
    const latLng = event.latLng;
    if (!latLng) return;

    const newMarker: MapMarkerData = { lat: latLng.lat(), lng: latLng.lng() };

    setMarkers((current:any) => {
      if (current.length >= 2) {
        return [newMarker];
      } else {
        return [...current, newMarker];
      }
    });

    setDistance(null);
  }, [setMarkers, setDistance]);

  const calculateDistance = () => {
    if (markers.length < 2) return;

    const pointA = new window.google.maps.LatLng(markers[0].lat, markers[0].lng);
    const pointB = new window.google.maps.LatLng(markers[1].lat, markers[1].lng);
    const distanceMeters = window.google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);

    setDistance(distanceMeters);
    setShow(false)
  };

  const onPlaceSelected = (autocompleteRef: React.RefObject<google.maps.places.Autocomplete>, index: number) => {
    const autocomplete = autocompleteRef.current as unknown as google.maps.places.Autocomplete;
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (place?.geometry?.location) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      setMarkers((prevMarkers) => {
        const newMarkers = [...prevMarkers];
        newMarkers[index] = location;
        return newMarkers;
      });

      mapRef.current?.panTo(location);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className={`${show ? "flex flex-col fixed" : "h-60"}  top-0 left-0 items-center w-full h-screen`}>
      <div className="fixed z-50 flex items-center justify-around space-x-4 py-4 w-8/12 bg-slate-100 rounded-b-lg">
        <button
          className="px-6 py-1.5 bg-primary text-white rounded hover:bg-primary-dark cursor-pointer"
          onClick={() => setShow(false)}
          type="button"
        >
          Kembali
        </button>
        <Autocomplete onLoad={(auto) => (startAutocompleteRef.current = auto)} onPlaceChanged={() => onPlaceSelected(startAutocompleteRef, 0)}>
          <div className="flex flex-col w-full">
            <label className="text-sm font-semibold my-2 text-gray-700">
              Titik Awal
            </label>
            <input
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary-light focus:rounded-lg focus:border-transparent"
              type="text"
              placeholder="Titik Awal"
            />
          </div>
        </Autocomplete>
        <Autocomplete onLoad={(auto) => (endAutocompleteRef.current = auto)} onPlaceChanged={() => onPlaceSelected(endAutocompleteRef, 1)}>
          <div className="flex flex-col w-full">
            <label className="text-sm font-semibold my-2 text-gray-700">
              Titik Akhir
            </label>
            <input
              type="text"
              placeholder="Titik Akhir"
              className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-primary-light focus:rounded-lg focus:border-transparent"
            />
          </div>
        </Autocomplete>
        <button
          className="px-6 py-1.5 bg-primary text-white rounded hover:bg-primary-dark cursor-pointer"
          type="button"
          onClick={calculateDistance}
        >
          Pilih
        </button>
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
      </GoogleMap>
      <div className="-mt-8 z-10">
        <p className='bg-white px-6 py-1 text-md border-t border-x font-semibold'>Distance : {(distance / 1000).toFixed(2) ?? ''} km</p>
      </div>
    </div>
  );

};

export default MapDistance;
