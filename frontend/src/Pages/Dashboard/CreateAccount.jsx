import React, { useState } from 'react'
import { database } from '../../Firebase'
import { ref } from 'firebase/database'
const Changepassword = () => {
    const [data,setData] = useState(null)
    const fetchData = async () => {
        const userRef = ref(database,'Users')
        try {
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.val()

            setData(userData ? Object.values(userData) : []);
        } catch (error) {
            
        }
    }
  return (
    <div>CreateAccount</div>
  )
}

export default Changepassword