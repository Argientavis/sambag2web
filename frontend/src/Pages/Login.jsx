import React, { useState, useRef } from "react";
import brgysambag from "../assets/backgroundImage.png";
import alert from "../assets/alarm.png";
<<<<<<< HEAD
import backgroundLogin from '../assets/backgroundLogin.png';
import forgotPassImage from '../assets/forgotPass.png';
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faUser,
  faLock,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
=======
import backgroundLogin from '../assets/backgroundLogin.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import forgotPassImage from '../assets/forgotPass.png'
import { faEye, faEyeSlash, faEnvelope, faUser, faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
>>>>>>> de383adc5e34fc6a3f8834cd84e12a93789d2569
import { useAuthStore } from "../Frontend-auth/auth.controller";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const recaptchaRef = useRef();

<<<<<<< HEAD
  const { forLogin, isLoading, error, role, forForgotPass } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await forLogin(username, password);
    if (result?.success) {
      alert('Login Successfully');
    } else {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleLogin(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [username, password]); // Add username and password as dependencies

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    const result = await forForgotPass(email);
    if (result?.success) {
      alert('Sent email for reset password successfully');
      setEmail('');
      setShowForgotPass(false);
=======
  const { forLogin, isLoading, error, forForgotPass } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Check if recaptchaRef is available
    if (recaptchaRef.current) {
      const recaptchaToken = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      
      // Pass the recaptchaToken to your login function
      const result = await forLogin(username, password, recaptchaToken); // Ensure forLogin accepts recaptchaToken
      if (result?.success) {
        alert('Login Successfully');
      } else {
        console.error(error);
      }
    }
  };

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    const result = await forForgotPass(email);
    if (result?.success) {
      alert('Sent email for reset password successfully');
      setEmail(''); 
      setShowForgotPass(false); 
>>>>>>> de383adc5e34fc6a3f8834cd84e12a93789d2569
    } else {
      alert('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="overflow-hidden h-screen">
      <div className="relative flex justify-center items-center h-screen">
        <img className="bg-cover w-full h-full absolute brightness-75" src={brgysambag} alt="" />
        <div className="h-[90%] w-[60%] rounded-lg bg-[#FFF6F0] relative">
          <div className="flex justify-center"></div>
          {showForgotPass ? (
            <>
              <div className="flex">
                <div className="w-2/3">
                  <div className="flex flex-col justify-center items-center gap-2">
                    <img className="h-[25vh] mt-2" src={forgotPassImage} alt="" />
                    <div className="flex flex-col justify-center items-center font-bold text-[4vh] text-[#163458]">
                      <h1>Forgot Pass</h1>
                      <h1 className="text-[10px] font-medium mt-3">Please enter your email. We will send you a link to reset</h1>
                      <h1 className="text-[10px] font-medium">your password</h1>
                    </div>
                    <form name="login">
                      <div className="mt-[10%] flex flex-col h-[2vh] gap-1">
<<<<<<< HEAD
                        <label className="font-bold" htmlFor="email">
                          Email:
                        </label>
=======
                        <label className="font-bold" htmlFor="email">Email:</label>
>>>>>>> de383adc5e34fc6a3f8834cd84e12a93789d2569
                        <div className="relative">
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
                            <FontAwesomeIcon icon={faEnvelope} />
                          </div>
                          <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="text"
                            placeholder="Enter Email"
                            className="ps-8 rounded-lg w-[25vw] py-2 border"
                          />
                        </div>
                        <div className="text-[12px] flex justify-end">
                          <button className="text-[#2203AC] underline" onClick={() => setShowForgotPass(false)}>Log in</button>
                        </div>
                        <div className="flex justify-center items-center mt-[6%] text-white">
                          <button
                            onClick={resetPasswordHandler}
                            className="bg-[#8A252C] py-1 px-1 w-[30%] rounded-md"
                          >
<<<<<<< HEAD
                            {isLoading ? (
                              <><FontAwesomeIcon className="animate-spin" icon={faSpinner} /></>
                            ) : (
                              <>Submit</>
                            )}
=======
                            {isLoading ? <FontAwesomeIcon className="animate-spin" icon={faSpinner} /> : <>Submit</>}
>>>>>>> de383adc5e34fc6a3f8834cd84e12a93789d2569
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
<<<<<<< HEAD

=======
>>>>>>> de383adc5e34fc6a3f8834cd84e12a93789d2569
                <div>
                  <img className="h-[90vh] w-[100%] rounded-lg" src={backgroundLogin} alt="" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex">
                <div className="w-2/3">
                  <div className="flex flex-col justify-center items-center gap-2">
                    <img className="h-[25vh] mt-2" src={alert} alt="" />
                    <div className="flex flex-col justify-center items-center font-bold text-[4vh] text-[#163458]">
                      <h1>Welcome to Sambag 2</h1>
                      <h1>Emergency Alert</h1>
                    </div>
                    <form name="login">
                      <div className="mt-[10%] flex flex-col h-[2vh] gap-1">
<<<<<<< HEAD
                        <label className="font-bold" htmlFor="username">
                          Username:
                        </label>
=======
                        <label className="font-bold" htmlFor="username">Username:</label>
>>>>>>> de383adc5e34fc6a3f8834cd84e12a93789d2569
                        <div className="relative">
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
                            <FontAwesomeIcon icon={faUser} />
                          </div>
                          <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter Username"
                            className="ps-8 rounded-lg w-[25vw] py-2 border"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="font-bold" htmlFor="password">Password:</label>
                          <div className="relative">
                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20">
                              <FontAwesomeIcon icon={faLock} />
                            </div>
<<<<<<< HEAD
                            <div className="absolute end-2 right-5 top-1/2 transofrm -translate-y-1/2 z-20">
                              <FontAwesomeIcon
                                onClick={togglePasswordVisibility}
                                icon={showPassword ? faEyeSlash : faEye}
                              />
=======
                            <div className="absolute end-2 right-5 top-1/2 transform -translate-y-1/2 z-20">
                              <FontAwesomeIcon onClick={() => setShowPassword(!showPassword)} icon={showPassword ? faEyeSlash : faEye} />
>>>>>>> de383adc5e34fc6a3f8834cd84e12a93789d2569
                            </div>
                            <input
                              id="password"
                              name="password"
                              onChange={(e) => setPassword(e.target.value)}
                              value={password}
                              type={showPassword ? "text" : "password"}
                              className="ps-8 rounded-lg w-[25vw] py-2 border"
                              placeholder="Enter Password"
                            />
                          </div>
                        </div>
                        <div className="text-[12px] flex justify-end">
<<<<<<< HEAD
                          <button onClick={(e) => setShowForgotPass(true, e.preventDefault())} className="text-[#2203AC] underline">Forgot Password</button>
                        </div>
                        <div className="flex justify-center items-center mt-[6%] text-white">
                          <button
                            onClick={handleLogin}
                            className="bg-[#8A252C] py-1 px-1 w-[30%] rounded-md"
                          >
                            {isLoading ? (
                              <><FontAwesomeIcon className="animate-spin" icon={faSpinner} /></>
                            ) : (
                              <>Login</>
                            )}
=======
                          <button onClick={(e) => { e.preventDefault(); setShowForgotPass(true); }} className="text-[#2203AC] underline">Forgot Password</button>
                        </div>
                        <div className="flex justify-center items-center mt-[6%] text-white">
                          <button onClick={handleLogin} className="bg-[#8A252C] py-1 px-1 w-[30%] rounded-md">
                            {isLoading ? <FontAwesomeIcon className="animate-spin" icon={faSpinner} /> : <>Login</>}
>>>>>>> de383adc5e34fc6a3f8834cd84e12a93789d2569
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
<<<<<<< HEAD

=======
>>>>>>> de383adc5e34fc6a3f8834cd84e12a93789d2569
                <div>
                  <img className="h-[90vh] w-[100%] rounded-lg" src={backgroundLogin} alt="" />
                </div>
              </div>
            </>
          )}
          {/* ReCAPTCHA Component */}
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LdR91cqAAAAAJ1uKrSb62NuVKQcIQoIv0Yjt5dy" // Replace with your actual site key
            size="invisible" // Make it invisible
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
