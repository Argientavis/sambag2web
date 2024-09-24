import React from 'react'
import logo from "../assets/sambaglogo.png";
import { faGear,faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#c0313b]">
    <div className="flex items-center gap-6">
      <img className="h-20 w-20" src={logo} alt="" />
      <h1 className="text-2xl text-white">ALERT SYSTEM</h1>
    </div>
    <div>
      <FontAwesomeIcon className="h-10 w-10 text-white" icon={faGear} />
    </div>
  </header>
  )
}

export default Navbar