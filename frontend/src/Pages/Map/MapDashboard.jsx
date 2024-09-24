import React, { useEffect, useState } from "react";
import { faGear, faMagnifyingGlass,faChartSimple,faCaretUp,faFireFlameCurved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Map from '../../Components/Map';
import { database } from "../../Firebase";
import { ref, get } from "firebase/database";
import { dateFormat } from "../../Components/DateFormatter";
import Navbar from "../../Components/Navbar";

const MapDashboard = () => {
  const [data, setData] = useState([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const [analytics, setShowAnalytics] = useState(false);

  const fetchData = async () => {
    const reportRef = ref(database, 'reports');

    try {
      const reportSnapshot = await get(reportRef);
      const reportData = reportSnapshot.val();
      setData(reportData ? Object.values(reportData) : []);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchData();
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
      <main className="flex">
        {/* Today's Report Section */}
        <section className="w-1/3 white h-[48rem] flex flex-col overflow-auto">
          <h1 className="flex justify-center items-center text-xl bg-[#8A252C] text-white py-2.5">
            Today's Report
          </h1>
          <div>
            {data.length > 0 ? (
              <div>
                {data.map((report, index) => {
                  const location = parseLocation(report.location);
                  return (
                    <div key={index} className="grid grid-cols-4 gap-2 bg-[#FFF6F0] border-b border-[#000000] border-opacity-30">
                      <img className="py-2 px-1" src={report.imageUrl} alt="" />
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
          <div className="text-white grid grid-cols-3">
            <div className="bg-[#801B22] text-white border-r border-white border-opacity-50 relative h-12 px-1">
              <div className="absolute flex items-center inset-y-0 ps-2 start-0">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white" />
              </div>
              <input type="text" className="text-gray-400 my-2 py-1 ps-6 rounded-sm w-full bg-[#8A252C]" placeholder="Search map..." />
            </div>
            <button className="bg-[#8A252C] border-r border-white border-opacity-50"><a href="">History</a></button>
            <button className="bg-[#8A252C]" onClick={() => setShowAnalytics(!analytics)}> <FontAwesomeIcon icon={faChartSimple}/> Analytics <FontAwesomeIcon icon={faCaretUp} className="h-3"/></button>
            <button></button>
            <button></button>
            {analytics && (
            <div className='grid grid-rows-3 bg-white text-black shadow-md'>
              <button className='shadow rounded-sm hover:bg-[#A53400] hover:text-white'><a href="/monthly-analytics">Monthly Reports</a></button>
              <button className='shadow rounded-sm hover:bg-[#A53400] hover:text-white'><a href="/annual-analytics">Annual Reports</a></button>
              <button className='shadow rounded-sm hover:bg-[#A53400] hover:text-white'><a href="/yearly-analytics">Yearly Reports</a></button>
            </div>
          )}
          </div>

          <div className="border border-gray-400 flex-grow">
            <Map selectedCoordinates={selectedCoordinates} data={data} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MapDashboard;
