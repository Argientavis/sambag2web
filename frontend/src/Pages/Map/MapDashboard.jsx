import React, { useEffect, useState } from "react";
import { faChartSimple, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Map from '../../Components/Map'; // Assuming the Map component is already present
import { database } from "../../Firebase";
import { ref, get } from "firebase/database";
import { dateFormat } from "../../utils/DateFormatter";
import Navbar from "../../Components/Navbar";
import { Link } from 'react-router-dom';
import fire from '../../assets/fire.png';
import thief from '../../assets/thief.png';
import noise from '../../assets/noise.png';
import StateModal from "../../modals/StateModal";
import axios from "axios";

// Simple in-memory cache for already fetched locations
const locationCache = {};

// Function to fetch address using LocationIQ API with retry mechanism
const fetchAddressWithLocationIQ = async (latitude, longitude, retries = 3) => {
    const apiKey = 'pk.c30d8633958601a90c3db02c060ae4c8'; // Replace with your LocationIQ API Key
    const cacheKey = `${latitude},${longitude}`;

    if (locationCache[cacheKey]) {
        return locationCache[cacheKey];
    }

    // Retry mechanism with exponential backoff and random delay
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await axios.get(
                `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`
            );
            if (response.data && response.data.display_name) {
                const address = response.data.display_name;
                locationCache[cacheKey] = address; // Cache the result
                return address;
            } else {
                locationCache[cacheKey] = "Address not available";
                return "Address not available";
            }
        } catch (error) {
            if (attempt < retries - 1) {
                console.warn(`Retrying request for ${latitude}, ${longitude}...`);
                await new Promise(resolve => setTimeout(resolve, (Math.pow(2, attempt) + Math.random()) * 1000));
            } else {
                console.error('Error fetching address:', error);
                locationCache[cacheKey] = "Address not available";
                return "Address not available";
            }
        }
    }
};

const MapDashboard = () => {
    const [data, setData] = useState([]);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(10); // Default zoom level
    const [analytics, setShowAnalytics] = useState(false);

    const fetchData = async () => {
        const reportRef = ref(database, 'led/reports');
        try {
            const reportSnapshot = await get(reportRef);
            const reportData = reportSnapshot.val();
            const reportsWithId = reportData ? Object.entries(reportData).map(([id, report]) => ({ id, ...report })) : [];

            reportsWithId.sort((a, b) => {
                const dateA = new Date(a.timestamp);
                const dateB = new Date(b.timestamp);
                return dateB - dateA;
            });

            const today = new Date();
            const updatedReports = await Promise.all(reportsWithId.map(async (report) => {
                const reportDate = new Date(report.timestamp);
                if (reportDate.getFullYear() === today.getFullYear() &&
                    reportDate.getMonth() === today.getMonth() &&
                    reportDate.getDate() === today.getDate()) {
                    report.markerType = "today";
                } else if (reportDate > today) {
                    report.markerType = "new";
                } else {
                    report.markerType = "old";
                }

                const location = parseLocation(report.location);
                if (location) {
                    report.address = await fetchAddressWithLocationIQ(location.latitude, location.longitude);
                } else {
                    report.address = "Location not available";
                }

                return report;
            }));

            setData(updatedReports);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 10000);
        return () => clearInterval(intervalId);
    }, []);

    const handleCoordinatesClick = (latitude, longitude) => {
        setSelectedCoordinates({ latitude, longitude });
        setZoomLevel(15); // Zoom level when a point is clicked, adjust as needed
    };

    const parseLocation = (location) => {
        const regex = /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/;
        const match = location.match(regex);
        return match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : null;
    };

    return (
        <div className="h-full w-full flex flex-col">
            <Navbar />
            <main className="flex-1 flex overflow-hidden">
                {/* Sidebar section */}
                <section className="lg:w-1/3 w-full bg-white h-full flex flex-col z-0">
                    <h1 className="flex justify-center items-center text-xl bg-[#8A252C] text-white py-2.5">
                        Today's Report
                    </h1>
                    {/* Color Indicator Section */}
                    <div className="p-2 bg-white border-b border-gray-300">
                        <h2 className="text-sm font-semibold mb-2">Marker Color Indicators:</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center mb-1">
                                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-xs">Today's Report</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-xs">New Report</span>
                            </div>
                            <div className="flex items-center mb-1">
                                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                                <span className="text-xs">Selected Report</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                                <span className="text-xs">Old Report</span>
                            </div>
                        </div>
                    </div>
                    {/* Report List Section */}
                    <div className="flex-1 overflow-y-auto">
                        {data.length > 0 ? (
                            <div className="max-h-[455px] overflow-y-auto">
                                {data.map((report, index) => {
                                    let incidentImage = report.type === 'FIRE' ? fire :
                                                        report.type === 'THIEF' ? thief : noise;

                                    const location = parseLocation(report.location);

                                    return (
                                        <div key={index} className="grid grid-cols-4 gap-2 bg-[#FFF6F0] border-b border-[#000000] border-opacity-30 p-2">
                                            <img className="w-full h-auto col-span-1" src={report.imageUrl || incidentImage} alt="Report" />
                                            <div className="col-span-3 flex flex-col justify-center ps-6">
                                                <h1 className="font-bold">
                                                    {report.address ? (
                                                        <span
                                                            onClick={() => handleCoordinatesClick(location.latitude, location.longitude)}
                                                            className={`text-blue-500 cursor-pointer ${report.address === "Address not available" ? 'text-gray-500' : ''}`}
                                                        >
                                                            {report.address !== "Address not available" ? report.address : "Location cannot be determined"}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">Fetching address...</span>
                                                    )}
                                                    <br />
                                                    <p className="text-[8px] font-medium">File Emergency - {dateFormat(report.timestamp)}</p>
                                                </h1>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center">No reports available.</p>
                        )}
                    </div>
                </section>

                {/* Map section */}
                <div className="flex-1 bg-white flex flex-col">
                    <div className="w-full bg-[#8A252C] flex flex-row divide-x divide-white">
                        <button className="flex-1 py-3 text-center text-white">Today's Report</button>
                        <Link to='/history' className="flex-1">
                            <button className="w-full py-3 text-center text-white">History</button>
                        </Link>
                        <button className="flex-1 py-3 text-center text-white flex items-center justify-center" onClick={() => setShowAnalytics(!analytics)}>
                            <FontAwesomeIcon icon={faChartSimple} className="mr-2" /> Analytics
                            <FontAwesomeIcon icon={faCaretUp} className="ml-1" />
                        </button>
                    </div>
                    {analytics && (
                        <div className='grid grid-rows-2 bg-white text-black shadow-md'>
                            <Link to='/monthly-analytics'>
                                <button className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'>Monthly Reports</button>
                            </Link>
                            <Link to='/yearly-analytics'>
                                <button className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'>Yearly Reports</button>
                            </Link>
                        </div>
                    )}
                    <StateModal />
                    <div className="flex-grow overflow-hidden">
                        <Map selectedCoordinates={selectedCoordinates} data={data} zoomLevel={zoomLevel} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MapDashboard;
