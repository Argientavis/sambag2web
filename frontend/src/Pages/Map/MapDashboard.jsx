import React, { useEffect, useState } from "react";
import { faChartSimple, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Map from '../../Components/Map';
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

const MapDashboard = () => {
    const [data, setData] = useState([]);
    const [selectedCoordinates, setSelectedCoordinates] = useState(null);
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
                return dateB - dateA; // Newest first
            });

            const today = new Date();
            await Promise.all(reportsWithId.map(async (report) => {
                const reportDate = new Date(report.timestamp);
                if (
                    reportDate.getFullYear() === today.getFullYear() &&
                    reportDate.getMonth() === today.getMonth() &&
                    reportDate.getDate() === today.getDate()
                ) {
                    report.markerType = "today"; // Today's report
                } else if (reportDate > today) {
                    report.markerType = "new"; // New report
                } else {
                    report.markerType = "old"; // Old report
                }

                const location = parseLocation(report.location);
                if (location) {
                    try {
                        const response = await axios.get(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
                        );
                        if (response.data && response.data.display_name) {
                            report.address = response.data.display_name;
                        } else {
                            report.address = "Address not available";
                        }
                    } catch (error) {
                        report.address = "Address not available";
                    }
                } else {
                    report.address = "Location not available";
                }
            }));

            setData(reportsWithId);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 3000); // Update interval to 3 seconds
        return () => clearInterval(intervalId);
    }, []);

    const handleCoordinatesClick = (latitude, longitude) => {
        setSelectedCoordinates({ latitude, longitude });
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
                <section className="lg:w-1/3 w-full bg-white h-full flex flex-col z-0">
                    <h1 className="flex justify-center items-center text-xl bg-[#8A252C] text-white py-2.5">
                        Today's Report
                    </h1>
                     {/* Color Indicator Section - Updated to Two-by-Two Grid */}
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
                    {/* Report List Section with Scroll */}
                    <div className="flex-1 overflow-y-auto">
                        {data.length > 0 ? (
                            <div className="max-h-[450px] overflow-y-auto"> {/* Updated scrollable container */}
                                {data.map((report, index) => {
                                    const location = parseLocation(report.location);
                                    let incidentImage;

                                    if (report.type === 'FIRE') {
                                        incidentImage = fire;
                                    } else if (report.type === 'THIEF') {
                                        incidentImage = thief;
                                    } else if (report.type === 'NOISE') {
                                        incidentImage = noise;
                                    }

                                    return (
                                        <div key={index} className="grid grid-cols-4 gap-2 bg-[#FFF6F0] border-b border-[#000000] border-opacity-30 p-2">
                                            <img className="w-full h-auto col-span-1" src={report.imageUrl} alt="Report" />
                                            <div className="col-span-3 flex flex-col justify-center ps-6">
                                                <h1 className="font-bold">
                                                    {location ? (
                                                        <span
                                                            onClick={() => handleCoordinatesClick(location.latitude, location.longitude)}
                                                            className="text-blue-500 cursor-pointer"
                                                        >
                                                            {report.address}
                                                        </span>
                                                    ) : "Location not available"}
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
                        <Map selectedCoordinates={selectedCoordinates} data={data} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MapDashboard;
