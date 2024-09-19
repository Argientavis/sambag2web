import React, { useState,useEffect } from "react";
import brgysambag from "../assets/brgysambag.jpg";
import logo from "../assets/sambaglogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../Frontend-auth/auth.controller";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); 
  const [email, setEmail] = useState(""); 

  
  const {forLogin,isLoading,error,role} = useAuthStore();
  

  
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await forLogin(username, password);
   if(result?.success){
    alert('Login Sucessfully')
   }else{
    console.error(error)
   }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
  };

  return (
    <div className="overflow-hidden h-screen">
      <div className="bg-[#FFFFFF] py-5 pl-20 font-bold text-xl w-full">
        WELCOME TO SAMBAG2 !
      </div>
      <div className="relative flex justify-center items-center h-screen">
        <img
          className="bg-cover w-full h-full absolute brightness-75"
          src={brgysambag}
          alt=""
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{ backgroundColor: "rgba(53, 85, 81, 0.75)" }}
        ></div>
        <div className="h-[33rem] w-[25rem] lg:w-[35rem] rounded-lg mt-[-5rem] bg-[#87ABA7] bg-opacity-80 relative">
          <div className="flex justify-center">
            <div className="h-32 w-32 rounded-full mt-10">
              <img src={logo} className="bg-cover w-full h-full" alt="" />
            </div>
          </div>
          {showForgotPass ? (
            <>
              <div className="mt-10 flex flex-col justify-center pl-16">
                <form onSubmit={handleForgotPassword}>
                  <label className="text-white font-bold" htmlFor="email">
                    Email:
                  </label>
                  <br />
                  <input
                    className="mb-6 h-8 rounded-[4px] w-5/6 bg-white border-transparent outline-none pl-4"
                    type="email"
                    name="email"
                    id="email"
                    value={email} // Controlled input
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <br />
                  <br />
                </form>
              </div>
              <div className="flex justify-end items-center pr-[4rem] lg:pr-[6rem] xl:pr-24">
                <button
                  className="text-white"
                  onClick={() => setShowForgotPass(false)}
                >
                  LOG IN
                </button>
              </div>
              <div className="flex justify-center mt-10">
                <button className="rounded-md w-32 h-10 mt-2 text-[#113156] font-bold bg-[#F0D859]">
                  SUBMIT
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mt-10 flex flex-col justify-center pl-16">
                <form name="login">
                  <label className="text-white font-bold" htmlFor="username">
                    Username:
                  </label>
                  <br />
                  <input
                    placeholder="Enter username"
                    value={username} // Controlled input
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-6 h-8 rounded-[4px] w-5/6 bg-white border-transparent outline-none pl-4"
                    type="text"
                    required
                    name="username"
                    id="username"
                    autoComplete="username"
                  />
                  <br />
                  <label className="text-white font-bold" htmlFor="password">
                    Password:
                  </label>
                  <br />
                  <div className="relative">
                    <input
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password} 
                      className="mb-4 h-8 rounded-[4px] w-5/6 bg-white border-transparent outline-none pl-4 pr-10"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      required
                      autoComplete="current-password"
                    />
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="relative right-8 text-gray-400 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    />
                  </div>
                  <br />
                </form>
              </div>
              <div className="flex justify-end items-center pr-[4rem] lg:pr-[6rem] xl:pr-24">
                <button
                  className="text-white"
                  onClick={() => setShowForgotPass(true)}
                >
                  Forgot Password?
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-center mt-10">
                <button onClick={handleLogin} className="rounded-md w-32 h-10 mt-2 text-[#113156] font-bold bg-[#F0D859]">
                  LOG IN
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
