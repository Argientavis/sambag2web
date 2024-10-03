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
    
            setData(reportsWithId);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 1000); 

        return () => clearInterval(intervalId);
    }, []);

    const handleCoordinatesClick = (latitude, longitude) => {
        console.log(`Coordinates clicked: ${latitude} ${longitude}`);
        setSelectedCoordinates({ latitude, longitude });
    };

    const parseLocation = (location) => {
        const regex = /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/;
        const match = location.match(regex);
        return match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : null;
    };

    return (
        <div>
            <Navbar />
            <StateModal />
            <main className="flex">
                <section className="w-1/3 white h-[48rem] flex flex-col overflow-auto">
                    <h1 className="flex justify-center items-center text-xl bg-[#8A252C] text-white py-2.5">
                        Today's Report
                    </h1>
                    <div>
                        {data.length > 0 ? (
                            <div>
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
                                        <div key={index} className="grid grid-cols-4 gap-2 bg-[#FFF6F0] border-b border-[#000000] border-opacity-30">
                                            <img className="py-2 px-1" src={report.imageUrl} alt="Report" />
                                            <div className="col-span-2 flex flex-col justify-center ps-6">
                                                <h1 className="font-bold">
                                                    {location ? (
                                                        <span
                                                            onClick={() => handleCoordinatesClick(location.latitude, location.longitude)}
                                                            className="text-blue-500 cursor-pointer"
                                                        >
                                                            {`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
                                                        </span>
                                                    ) : "Location not available"}
                                                    <br />
                                                    <p className="text-[8px] font-medium">File Emergency - {dateFormat(report.timestamp)}</p>
                                                </h1>
                                            </div>
                                            {incidentImage && (
                                                <img className="mt-8 h-[8vh]" src={incidentImage} alt={report.type} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>No reports available.</p>
                        )}
                    </div>
                </section>

                <div className="w-full bg-white flex flex-col">
                    <div className="text-white grid grid-cols-2">
                        <Link to='/history'>
                            <button className="bg-[#8A252C] border-r w-full border-white border-opacity-50 py-3">History</button>
                        </Link>
                        <button className="bg-[#8A252C]" onClick={() => setShowAnalytics(!analytics)}>
                            <FontAwesomeIcon icon={faChartSimple} /> Analytics &nbsp;
                            <FontAwesomeIcon icon={faCaretUp} className="h-3" />
                        </button>
                    </div>
                    {analytics && (
                        <div className='grid grid-rows-3 bg-white text-black shadow-md'>
                            <Link to='/monthly-analytics'>
                                <button className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'>Monthly Reports</button>
                            </Link>
                            <Link to='/annual-analytics'>
                                <button className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'>Annual Reports</button>
                            </Link>
                            <Link to='/yearly-analytics'>
                                <button className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'>Yearly Reports</button>
                            </Link>
                        </div>
                    )}
                    <div className="border border-gray-400 flex-grow">
                        <Map selectedCoordinates={selectedCoordinates} data={data} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MapDashboard;
