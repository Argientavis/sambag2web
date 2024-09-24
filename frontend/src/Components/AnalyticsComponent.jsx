import React, { useState } from 'react'
import Navbar from './Navbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass,faCaretUp,faChartSimple } from '@fortawesome/free-solid-svg-icons'

const AnalyticsComponent = () => {
const [analytics,setShowAnalytics] = useState(false)
  return (
    <div>
        <Navbar/>
        <div className='grid grid-cols-4'>
            <a className='bg-[#8A252C] flex justify-center items-center text-white' href="/map-dashboard"><h1 className=''>Reports</h1></a>
            <div className="bg-[#801B22] text-white border-r border-white border-opacity-50 relative h-12 px-1">
            <div className="absolute flex items-center inset-y-0 ps-2 start-0 ">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white"/>
            </div>   
            <input type="text" className=" text-gray-400 my-2 py-1 ps-6 rounded-sm w-full bg-[#8A252C]" placeholder="Search map..."  />
          </div>
          <button className='bg-[#801B22] text-white border-r border-white border-opacity-50'>History</button>
          <div className='bg-[#801B22] text-white flex justify-center items-center gap-3 relative'>
          <button className='flex gap-2' onClick={()=>setShowAnalytics(!analytics)}>
            <h1><FontAwesomeIcon icon={faChartSimple}/> Analytics</h1>
            <h1><FontAwesomeIcon icon={faCaretUp} className='h-3'/></h1>
          </button>
          </div>
        </div>
        {analytics &&(
          <div className='grid grid-cols-4'>
            <div></div>
            <div></div>
            <div></div>
            <div className=' grid grid-rows-3 bg-white shadow-md'>
              <button className='shadow rounded-sm hover:bg-[#A53400] hover:text-white'><a href="/monthly-analytics">Monthly Reports</a></button>
              <button className='shadow rounded-sm hover:bg-[#A53400] hover:text-white'><a href="/annual-analytics">Annual Reports</a></button>
              <button className='shadow rounded-sm hover:bg-[#A53400] hover:text-white'><a href="yearly-analytics">Yearly Reports</a></button>
            </div>
            </div>
          )}
    </div>
  )
}

export default AnalyticsComponent