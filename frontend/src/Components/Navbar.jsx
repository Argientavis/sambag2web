import React, { useState } from 'react'
import logo from "../assets/sambaglogo.png";
import { faGear,faMagnifyingGlass,faRightFromBracket,faUser,faLock} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthStore } from '../Frontend-auth/auth.controller';

const Navbar = () => {
  const {forLogout,role} = useAuthStore()
  const [showSetting,setShowSettings] = useState(false)

  const handleLogout = async () =>{
    await forLogout();
  }
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#c0313b]">
    <div className="flex items-center gap-6">
      <img className="h-20 w-20" src={logo} alt="" />
      <h1 className="text-2xl text-white">ALERT SYSTEM</h1>
    </div>
    <div className='relative mr-10'>
      <button><FontAwesomeIcon className="h-8 w-8 text-white" icon={faGear} onClick={()=>setShowSettings(!showSetting)} /></button>
      {showSetting && (
       <div className='absolute bg-white flex flex-col justify-center py-1 px-1 left-1/2 transform -translate-x-1/2 rounded-md text-sm z-50'>
          <button className='flex  items-center px-1 py-0.5 gap-2 hover:bg-[#801B22] hover:text-white'><FontAwesomeIcon icon={faRightFromBracket}/>Logout</button> 
            {role === 'admin'&&(
              <button className='flex  items-center px-1 py-0.5 gap-2 hover:bg-[#801B22] hover:text-white whitespace-nowrap'> <FontAwesomeIcon icon={faUser}/>Create Account</button>
            )}
            <button className='flex  items-center px-1 py-0.5 gap-2 hover:bg-[#801B22] hover:text-white whitespace-nowrap'><FontAwesomeIcon icon={faLock}/>Change Password</button>
       </div>
      )}
      
    </div>
  </header>
  )
}

export default Navbar