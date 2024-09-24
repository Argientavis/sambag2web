import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import redIconUrl from '../assets/redIcon1.png'; 

// Custom icon for the red marker
const redIcon = new L.Icon({
    iconUrl: redIconUrl,
    iconSize: [42, 40], 
    iconAnchor: [20, 41], 
    popupAnchor: [1, -34], 
});

const Map = ({ selectedCoordinates, data }) => {
    const [selectedMarker, setSelectedMarker] = useState(null); 
    const [selectedReport, setSelectedReport] = useState(null); 

    useEffect(() => {
        if (selectedCoordinates) {
            const { latitude, longitude } = selectedCoordinates;

            // Check if latitude and longitude are valid numbers
            if (latitude && longitude) {
                // Set the selected marker to the clicked coordinates
                setSelectedMarker({ latitude, longitude });

                // Find the report that matches the selected coordinates
                const matchedReport = data.find(report => {
                    const location = parseLocation(report.location);
                    return location && location.latitude === latitude && location.longitude === longitude;
                });
                
                setSelectedReport(matchedReport); // Set the associated report
            }
        }
    }, [selectedCoordinates, data]);

    const parseLocation = (location) => {
        const regex = /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/;
        const match = location.match(regex);
        return match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : null;
    };

    return (
        <MapContainer className="leaflet_container" center={[10.3058, 123.8910]} zoom={17} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map((report, index) => {
                const location = parseLocation(report.location);
                return location && !(selectedMarker && selectedMarker.latitude === location.latitude && selectedMarker.longitude === location.longitude) ? (
                    <Marker key={index} position={[location.latitude, location.longitude]}>
                        <Popup>
                            <div>
                                <h4>Name: {report.name}</h4>
                                <h4>Type: {report.type}</h4>
                                <h4>Contact: {report.contact}</h4>
                                <img src={report.imageUrl} alt="" />
                            </div>
                        </Popup>
                    </Marker>
                ) : null;
            })}
            {selectedMarker && (
                <Marker key="selected-marker" position={[selectedMarker.latitude, selectedMarker.longitude]} icon={redIcon}>
                    <Popup>
                        <div>
                            <div>Clicked Coordinates: {selectedMarker.latitude}, {selectedMarker.longitude}</div>
                            {selectedReport ? ( // Check if there is a matched report
                                <>
                                    <h4>Name: {selectedReport.name}</h4>
                                    <h4>Type: {selectedReport.type}</h4>
                                    <h4>Contact: {selectedReport.contact}</h4>
                                    <img src={selectedReport.imageUrl} alt="" />
                                </>
                            ) : (
                                <p>No report information available.</p>
                            )}
                        </div>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default Map;
