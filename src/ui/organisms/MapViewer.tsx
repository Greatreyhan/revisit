import React, { useRef } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import type { GoogleMap as GoogleMapType } from "@react-google-maps/api";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapViewerProps {
  mapMarkers: LatLng[];
  mapDistance: number;
}

const center = {
  lat: -6.200000,
  lng: 106.816666,
};

const containerStyle = {
  width: '100%',
  height: '400px',
};

// const getCenter = (markers: LatLng[]): LatLng => {
//   if (markers.length < 2) return markers[0] || center;
//   return {
//     lat: (markers[0].lat + markers[1].lat) / 2,
//     lng: (markers[0].lng + markers[1].lng) / 2,
//   };
// };

const MapViewer: React.FC<MapViewerProps> = ({ mapMarkers, mapDistance }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDy_z3fG3Rb-WyX79DazneEBw5sqjpWy-s',
  });
  const mapRef = useRef<GoogleMapType | null>(null);


  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${mapMarkers ? "flex flex-col" : "hidden"} items-center`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={8}
        center={center}
        onLoad={(map) => (mapRef.current = map)}
      >
        {mapMarkers?.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </GoogleMap>
      <div className="-mt-8 z-10">
        <p className='bg-white px-6 py-1 text-md border-t border-x font-semibold'>Distance : {(mapDistance / 1000).toFixed(2) ?? ''} km</p>
      </div>
    </div>
  );
};

export default MapViewer;
