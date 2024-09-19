import React from "react";
import logo from "../../assets/sambaglogo.png";
import { faGear,faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Map from '../../Components/Map'

const MapDashboard = () => {
  return (
    <div>
      {/*Header*/}
      <header className="flex justify-between items-center px-6 py-4 bg-[#c0313b]">
        <div className="flex items-center gap-6">
          <img className="h-20 w-20" src={logo} alt="" />
          <h1 className="text-2xl text-white">ALERT SYSTEM</h1>
        </div>
        <div>
          <FontAwesomeIcon className="h-10 w-10 text-white" icon={faGear} />
        </div>
      </header>

      <main className="flex">
      {/*Today's Report */}
     <section className="w-1/3 white h-[48rem] flex flex-col">
       <h1 className="flex justify-center items-center text-xl bg-[#8A252C] text-white py-2.5">
        Today's Report
       </h1>
      <div>
     hello
      </div>
      
     </section>
     <div className="w-full bg-black flex flex-col">
     <div className="text-white grid grid-cols-4">
     <div className="bg-[#801B22] text-white border-r border-white border-opacity-50 relative h-12 px-1">
            <div className="absolute flex items-center inset-y-0 ps-2 start-0 ">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white"/>
            </div>   
            <input type="text" className=" text-gray-400 my-2 py-1 ps-6 rounded-sm w-full bg-[#8A252C]" placeholder="Search map..."  />
          </div>
     <button className="flex justify-center items-center bg-[#801B22] py-2.5 text-md border-r border-white border-opacity-50">History</button>
     <button className="flex justify-center items-center bg-[#801B22] py-2.5 text-md border-r border-white border-opacity-50">Monthly Report</button>
     <button className="flex justify-center items-center bg-[#801B22] py-2.5 text-md">Yearly Report</button>
     </div>
     <div className="border border-gray-400">
             
              <Map/>
            </div>
     </div>
      </main>
    </div>
  );
};

export default MapDashboard;
