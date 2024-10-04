import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import redIconUrl from '../assets/redicon.png';
import greenIconUrl from '../assets/greenicon.png';
import yellowIconUrl from '../assets/yellowicon.png';
import blueIconUrl from '../assets/blueicon.png'; // New icon for latest reports
import responded from '../assets/check.png';
import notresponded from '../assets/deny.png';
import { database } from '../Firebase';
import { push, ref, remove } from "firebase/database";

// Custom icons
const redIcon = new L.Icon({
    iconUrl: redIconUrl,
    iconSize: [42, 40],
    iconAnchor: [20, 41],
    popupAnchor: [1, -34],
});

const greenIcon = new L.Icon({
    iconUrl: greenIconUrl,
    iconSize: [42, 40],
    iconAnchor: [20, 41],
    popupAnchor: [1, -34],
});

const yellowIcon = new L.Icon({
    iconUrl: yellowIconUrl,
    iconSize: [42, 40],
    iconAnchor: [20, 41],
    popupAnchor: [1, -34],
});

const blueIcon = new L.Icon({ // Blue icon for the latest reports
    iconUrl: blueIconUrl,
    iconSize: [42, 40],
    iconAnchor: [20, 41],
    popupAnchor: [1, -34],
});

const Map = ({ selectedCoordinates, data }) => {
    const mapRef = useRef(); // Reference to the map instance
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false); // State for showing modal
    const [latestReport, setLatestReport] = useState(null); // State for latest report

    useEffect(() => {
        if (selectedCoordinates && mapRef.current) {
            const { latitude, longitude } = selectedCoordinates;

            if (latitude && longitude) {
                setSelectedMarker({ latitude, longitude });

                // Move the map to the selected coordinates
                mapRef.current.flyTo([latitude, longitude], 17);

                const matchedReport = data.find(report => {
                    const location = parseLocation(report.location);
                    return location && location.latitude === latitude && location.longitude === longitude;
                });

                setSelectedReport(matchedReport);
            }
        }
    }, [selectedCoordinates, data]);

    useEffect(() => {
        if (data.length > 0) {
            const latestReportData = data[0]; // Assuming the data is sorted, get the latest report
            setLatestReport(latestReportData);
            setShowModal(false); // Show modal for latest report
        }
    }, [data]);

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

    const isToday = (timestamp) => {
        const today = new Date();
        const reportDate = new Date(timestamp);
        return (
            today.getFullYear() === reportDate.getFullYear() &&
            today.getMonth() === reportDate.getMonth() &&
            today.getDate() === reportDate.getDate()
        );
    };

    return (
        <div className="relative w-full h-full">
            <MapContainer
                className="leaflet_container z-0 w-full h-full lg:h-[calc(100vh-120px)]" // Responsive height adjustments for different screen sizes
                center={[10.3058, 123.8910]}
                zoom={17}
                scrollWheelZoom={true}
                ref={mapRef} // Attach ref to the map container
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {data.map((report, index) => {
                    const location = parseLocation(report.location);
                    if (!location) return null;

                    // Determine which icon to use
                    const reportDate = new Date(report.timestamp);
                    const currentDate = new Date();
                    let markerIcon;

                    if (isToday(report.timestamp)) {
                        markerIcon = blueIcon; // Latest reports with today's date (blue color)
                    } else if (reportDate > currentDate) {
                        markerIcon = redIcon; // New reports (future-dated)
                    } else {
                        markerIcon = yellowIcon; // Old reports
                    }

                    return !(selectedMarker && selectedMarker.latitude === location.latitude && selectedMarker.longitude === location.longitude) ? (
                        <Marker key={index} position={[location.latitude, location.longitude]} icon={markerIcon}>
                            <Popup>
                                <div>
                                    <h4>Name: {report.name}</h4>
                                    <h4>Type: {report.type}</h4>
                                    <h4>Contact: {report.contact}</h4>
                                    <img className="w-full h-auto" src={report.imageUrl} alt="" />
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
                            <div className="">
                                <div>Clicked Coordinates: {selectedMarker.latitude}, {selectedMarker.longitude}</div>
                                <h4>Name: {selectedReport.name}</h4>
                                <h4>Type: {selectedReport.type}</h4>
                                <h4>Contact: {selectedReport.contact}</h4>
                                <img className="h-[100%] w-[100%]" src={selectedReport.imageUrl} alt="" />
                                <div className="flex justify-center gap-2 mt-4">
                                    <img onClick={() => handleSuccess(false)} className="h-8 cursor-pointer" src={notresponded} alt="Not Responded" />
                                    <img onClick={() => handleSuccess(true)} className="h-8 cursor-pointer" src={responded} alt="Responded" />
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Modal for Latest Report, displayed as an overlay on top of the map */}
            {latestReport && showModal && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-md w-[90%] max-w-md">
                        <h2 className="text-lg font-bold mb-2">Latest Report</h2>
                        <h4>Name: {latestReport.name}</h4>
                        <h4>Type: {latestReport.type}</h4>
                        <h4>Contact: {latestReport.contact}</h4>
                        <img className="h-[2%] w-[2%] my-2" src={latestReport.imageUrl} alt="Latest Report" />
                        <div className="flex justify-end mt-2">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-red-500 text-white rounded">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map;
