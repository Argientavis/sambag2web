import React from 'react'
import logo from "../assets/sambaglogo.png";
import { faGear,faMagnifyingGlass,faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthStore } from '../Frontend-auth/auth.controller';

const Navbar = () => {
  const {forLogout} = useAuthStore()

  const handleLogout = async () =>{
    await forLogout();
  }
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#c0313b]">
    <div className="flex items-center gap-6">
      <img className="h-20 w-20" src={logo} alt="" />
      <h1 className="text-2xl text-white">ALERT SYSTEM</h1>
    </div>
    <div>
      <button><FontAwesomeIcon className="h-6 w-6 text-white" icon={faRightFromBracket} onClick={handleLogout} /></button>
    </div>
  </header>
  )
}

export default Navbar