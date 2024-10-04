import React, { useState, useEffect, useRef } from "react";
import AnalyticsComponent from "../../Components/AnalyticsComponent";
import { database } from "../../Firebase";
import { get, ref } from "firebase/database";
import ReactPaginate from "react-paginate";
import { useDownloadExcel } from 'react-export-table-to-excel';
import axios from 'axios';

const History = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const tableRef = useRef(null);

  // Function to parse location and return latitude and longitude
  const parseLocation = (location) => {
    const regex = /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/;
    const match = location.match(regex);
    return match ? { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) } : null;
  };

  // Function to fetch address from coordinates using reverse geocoding
  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      return response.data?.display_name || "Address not available";
    } catch (error) {
      console.error('Error fetching address:', error);
      return "Address not available";
    }
  };

  // Function to fetch data from the "History" node in the database
  const fetchData = async () => {
    const historyRef = ref(database, "History");
    try {
      const historySnapshot = await get(historyRef);
      const historyData = historySnapshot.val();
      const dataWithAddress = historyData ? Object.values(historyData) : [];

      // Fetch address for each report
      await Promise.all(dataWithAddress.map(async (report) => {
        if (report.location) {
          const location = parseLocation(report.location);
          if (location) {
            report.address = await fetchAddress(location.latitude, location.longitude);
          } else {
            report.address = "Location not available";
          }
        }
      }));

      setData(dataWithAddress);
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'History Table',
    sheet: 'History'
  });

  return (
    <div>
      <AnalyticsComponent />
      <button className="mx-[4%] mt-[6%] bg-[#801B22] text-white rounded-md py-1 mb-2 px-2 font-sans" onClick={onDownload}> Export to excel </button>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-[4%]" ref={tableRef}>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-[#801B22]">
            <tr>
              <th scope="col" className="px-6 py-3 border-r border-white border-opacity-50">Type of Report</th>
              <th scope="col" className="px-6 py-3 border-r border-white border-opacity-50">Name</th>
              <th scope="col" className="px-6 py-3 border-r border-white border-opacity-50">Contact Number</th>
              <th scope="col" className="px-6 py-3 border-r border-white border-opacity-50">Time</th>
              <th scope="col" className="px-6 py-3">Location</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.type}</th>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.contact}</td>
                <td className="px-6 py-4">{item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}</td>
                <td className="px-6 py-4">{item.address || 'Location not available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mx-[4%] mt-[2%]"> {/* Remove justify-between and make justify-end to remove the left-side button */}
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName="pagination flex justify-end gap-4"
          activeClassName="active bg-[#801B22] px-2 h-[100%] text-white"
          previousLabel="Previous"
          nextLabel="Next"
        />
      </div>
    </div>
  );
};

export default History;
