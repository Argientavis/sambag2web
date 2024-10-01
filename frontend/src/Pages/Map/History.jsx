import React, { useState, useEffect,useRef } from "react";
import AnalyticsComponent from "../../Components/AnalyticsComponent";
import { database } from "../../Firebase";
import { get, ref } from "firebase/database";
import ReactPaginate from "react-paginate";
import { useDownloadExcel } from 'react-export-table-to-excel';


const History = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2); 
  const [showDropdown, setShowDropdown] = useState(false);
  const tableRef = useRef(null);

  const fetchData = async () => {
    const historyRef = ref(database, "History");
    try {
      const historySnapshot = await get(historyRef);
      const historyData = historySnapshot.val();
      setData(historyData ? Object.values(historyData) : []);
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

 

  const handlePageSelect = (page) => {
    setCurrentPage(page); 
    setShowDropdown(false); 
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'History Table',
    sheet: 'History'
})

  return (
    <div>
      <AnalyticsComponent />
      <button className="mx-[4%] mt-[6%] bg-[#801B22] text-white rounded-md py-1 mb-2 px-2 font-sans" onClick={onDownload}> Export to excel </button>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-[4%]" ref={tableRef}>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-white uppercase bg-[#801B22] dark:bg-gray-700 dark:text-gray-400">
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
                <td className="px-6 py-4">{item.time}</td>
                <td className="px-6 py-4">Sambag2</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mx-[4%] mt-[2%]">
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Page: {currentPage}
          </button>
          {showDropdown && (
            <div className="absolute z-10 bg-white w-full flex flex-col justify-center shadow-lg rounded mt-1">
              {Array.from({ length: pageCount }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageSelect(index + 1)} 
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName="pagination flex justify-end gap-4"
          activeClassName="active bg-[#801B22] px-2 h-[65%] text-white" 
          previousLabel="Previous"
          nextLabel="Next"
        />
      </div>
    </div>
  );
};

export default History;
