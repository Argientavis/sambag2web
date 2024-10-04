import React, { useState } from 'react'
import Navbar from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass,faCaretUp,faChartSimple } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

const AnalyticsComponent = () => {
const [analytics,setShowAnalytics] = useState(false)
  return (
    <div>
        <Navbar/>
        <div className='grid grid-cols-3'>
            <a className='bg-[#8A252C] flex justify-center items-center text-white py-3' href="/map-dashboard"><h1 className=''>Reports</h1></a>
          <Link to='/history'><button className='bg-[#801B22] text-white border-r w-full py-3 border-white border-opacity-50'>History</button></Link>
          <div className='bg-[#801B22] text-white flex justify-center items-center gap-3 relative'>
          <button className='flex gap-2' onClick={()=>setShowAnalytics(!analytics)}>
            <h1><FontAwesomeIcon icon={faChartSimple}/> Analytics</h1>
            <h1><FontAwesomeIcon icon={faCaretUp} className='h-3'/></h1>
          </button>
          </div>
        </div>
        {analytics &&(
          <div className='grid grid-cols-3'>
            <div></div>
            <div></div>
            <div className=' grid grid-rows-2 bg-white shadow-md'>
              <Link to='/monthly-analytics'>
                <button className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'>Monthly Reports</button>
              </Link>
              <Link to='/yearly-analytics'>
                <button className='shadow rounded-sm hover:bg-[#A53400] w-full hover:text-white'>Yearly Reports</button>
              </Link>
            </div>
            </div>
          )}
    </div>
  )
}

export default AnalyticsComponent