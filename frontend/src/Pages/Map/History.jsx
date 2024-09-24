import React, { useState, useEffect } from 'react';
import AnalyticsComponent from '../../Components/AnalyticsComponent';
import { database } from '../../Firebase';
import { get, ref } from 'firebase/database';

const History = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const historyRef = ref(database, 'History');
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

    return (
        <div>
            <AnalyticsComponent />

            <div className='grid grid-cols-5 bg-[#801B22] mt-10 mx-40 text-white'>
                <h1 className='flex justify-center border-r border-white border-opacity-50 py-3'>Type of Report</h1>
                <h1 className='flex justify-center border-r border-white border-opacity-50 py-3'>Name</h1>
                <h1 className='flex justify-center border-r border-white border-opacity-50 py-3'>Number</h1>
                <h1 className='flex justify-center border-r border-white border-opacity-50 py-3'>Location</h1>
                <h1 className='flex justify-center border-r border-white border-opacity-50 py-3'>Success Status</h1>
                
                {data.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className='flex justify-center items-center py-2 bg-[#FFF6F0] text-black border-b border-black border-opacity-50 '>{item.type}</div>
                        <div className='flex justify-center items-center py-2 bg-[#FFF6F0] text-black border-b border-black border-opacity-50  '>{item.name}</div>
                        <div className='flex justify-center items-center py-2 bg-[#FFF6F0] text-black border-b border-black border-opacity-50 '>{item.contact}</div>
                        <div className='flex justify-center items-center py-2 bg-[#FFF6F0] text-black border-b border-black border-opacity-50 text-sm '>{item.location}</div>
                        <div className='flex justify-center items-center py-2 bg-[#FFF6F0] text-black border-b border-black border-opacity-50'>{item.success}</div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default History;
