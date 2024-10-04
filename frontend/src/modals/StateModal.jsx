import React, { useEffect, useState } from 'react';
import { database } from '../Firebase';
import { ref, onValue, update } from 'firebase/database';

const StateModal = () => {
    const [state, setState] = useState(null);
    const [latestReport, setLatestReport] = useState(null);

    useEffect(() => {
        const stateRef = ref(database, 'led/state');
        const unsubscribe = onValue(stateRef, (snapshot) => {
            const stateData = snapshot.val();
            setState(stateData);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (state > 0) {
            const reportRef = ref(database, 'led/reports');
            const unsubscribe = onValue(reportRef, (snapshot) => {
                const reportData = snapshot.val();
                if (reportData) {
                    const reportValues = Object.values(reportData);
                    const newReport = reportValues[reportValues.length - 1]; // Get the latest report
                    setLatestReport(newReport);
                }
            });

            return () => unsubscribe();
        }
    }, [state]);

    const handleOffAlarm = async () => {
        const stateRef = ref(database, 'led/state');

        try {
            await update(stateRef, { state: 0 });
            setState(0);
            setLatestReport(null); // Clear the latest report when alarm is turned off
        } catch (error) {
            console.error('Error updating state:', error);
        }
    };

    return (
        <div className={`${state > 0 ? 'fixed w-[75%] h-screen z-50 flex justify-center items-center bg-black bg-opacity-50' : ''}`}>
            {state > 0 && latestReport && (
                <div className='bg-white p-4 rounded shadow-lg flex flex-col gap-4'>
                    <p>New report</p>
                    <p>Type: {latestReport.type}</p>
                    <p>Location: {latestReport.location}</p>
                    <button onClick={handleOffAlarm} className='bg-[#8A252C] text-white rounded-md'>Off Alarm</button>
                </div>
            )}
        </div>
    );
};

export default StateModal;
