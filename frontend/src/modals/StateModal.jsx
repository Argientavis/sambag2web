import React, { useEffect, useState } from 'react';
import { database } from '../Firebase';
import { ref, get, update } from 'firebase/database';

const StateModal = () => {
    const [state, setState] = useState(null);

    const fetchState = async () => {
        const stateRef = ref(database, 'led/state');
        try {
            const stateSnapshot = await get(stateRef);
            const stateData = stateSnapshot.val();
            setState(stateData.state)
        } catch (error) {
            console.error('Error fetching state', error);
        }
    };

    useEffect(() => {
        fetchState();
        const intervalId = setInterval(fetchState, 1000); 

        return () => clearInterval(intervalId);
    }, []);

    const handleOffAlarm = async () => {
        const stateRef = ref(database, 'led/state'); 

        try {
            await update(stateRef, { state: 0 }); 
            setState(0);
        } catch (error) {
            console.error('Error updating state:', error);
        }
    };

    return (
        <div className={`${state > 0 ? 'fixed w-screen h-screen z-50 flex justify-center items-center bg-black bg-opacity-50': ''}`}>
            {state > 0 && (
                <div className='bg-white p-4 rounded shadow-lg flex flex-col gap-4'>
                    <p>New report</p>
                    <button onClick={handleOffAlarm} className='bg-[#8A252C] text-white rounded-md'>Off Alarm</button>
                </div>
            )}
        </div>
    );
};

export default StateModal;
