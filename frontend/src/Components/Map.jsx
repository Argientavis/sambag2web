import React from "react";
    import { MapContainer } from "react-leaflet/MapContainer";
    import { TileLayer } from "react-leaflet/TileLayer";
    import { useMap } from "react-leaflet/hooks";
    import { Marker } from 'react-leaflet'
    import { Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import './map.css'
const Map = () => {
    const center = [10.3058, 123.8910]
  return (
    <div>
      <MapContainer className="leaflet_container"  center={center} zoom={17} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[10.3055, 123.8906]}>
          <Popup>
            Barangay Hall of Sambag2
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
