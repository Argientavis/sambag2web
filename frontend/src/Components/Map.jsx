import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import redIconUrl from '../assets/redIcon1.png'; 
import responded from '../assets/check.png';
import notresponded from '../assets/deny.png';
import { database } from '../Firebase';
import { push, ref, remove } from "firebase/database";

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

            if (latitude && longitude) {
                setSelectedMarker({ latitude, longitude });

                const matchedReport = data.find(report => {
                    const location = parseLocation(report.location);
                    return location && location.latitude === latitude && location.longitude === longitude;
                });

                setSelectedReport(matchedReport);
            }
        }
    }, [selectedCoordinates, data]);

    const parseLocation = (location) => {
        const regex = /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/;
        const match = location.match(regex);
        return match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : null;
    };

    const handleSuccess = async (success) => {
        if (!selectedReport || !selectedReport.id) {
            console.warn("Selected report is not valid or missing ID.");
            return;
        }

        console.log("Deleting report with ID:", selectedReport.id); 

        try {
            const historyRef = ref(database, 'History'); 
            const dataToPush = {
                name: selectedReport.name,
                contact: selectedReport.contact,
                type: selectedReport.type,
                location: selectedReport.location,
                success: success ? "Yes" : "No"
            }; 
            await push(historyRef, dataToPush);

            const reportRef = ref(database, `led/reports/${selectedReport.id}`);
            await remove(reportRef);
            console.log("Report deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error pushing data to database: ", error);
        }
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
                                <div className="flex justify-center gap-2 mt-4">
                                    <img onClick={() => handleSuccess(false)} className="h-8 cursor-pointer" src={notresponded} alt="Not Responded" />
                                    <img onClick={() => handleSuccess(true)} className="h-8 cursor-pointer" src={responded} alt="Responded" />
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ) : null;
            })}
            {selectedMarker && selectedReport && (
                <Marker key="selected-marker" position={[selectedMarker.latitude, selectedMarker.longitude]} icon={redIcon}>
                    <Popup>
                        <div>
                            <div>Clicked Coordinates: {selectedMarker.latitude}, {selectedMarker.longitude}</div>
                            <h4>Name: {selectedReport.name}</h4>
                            <h4>Type: {selectedReport.type}</h4>
                            <h4>Contact: {selectedReport.contact}</h4>
                            <img src={selectedReport.imageUrl} alt="" />
                            <div className="flex justify-center gap-2 mt-4">
                                <img onClick={() => handleSuccess(false)} className="h-8 cursor-pointer" src={notresponded} alt="Not Responded" />
                                <img onClick={() => handleSuccess(true)} className="h-8 cursor-pointer" src={responded} alt="Responded" />
                            </div>
                        </div>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default Map;
