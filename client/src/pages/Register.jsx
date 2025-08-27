import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaRegCheckCircle } from 'react-icons/fa'
import SummaryApi from "../helpers/SummaryApi";
import {toast} from 'react-toastify'
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import GoogleLogin from "../components/GoogleLogin";
// import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // username: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0); 
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const err = {};
    if (!form.firstName) err.firstName = "First name required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) err.email = "Valid email required";
    // if (!form.username) err.username = "Username required";
    // if (form.password.length < 8) err.password = "Min 8 characters required";
    if (form.password !== form.confirmPassword) err.confirmPassword = "Passwords don't match";
    if (!otpVerified) err.otp = "OTP not verified";
    return err;
  };

  const handleSendOtp = async() => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setError((prev) => ({ ...prev, email: "Enter valid email before sending OTP" }));
      return;
    }

    setSendingOtp(true)
    try {
      const res = await fetch(SummaryApi.sendOtp.url, {
        method: SummaryApi.sendOtp.method,
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email: form.email })
      })
      const data = await res.json()
      if(data.success){
        setOtpSent(true)
        toast.success(data.message)
        setTimer(60)
      }
    } 
    catch (err) {
      console.error(err);
      toast.error("Failed to send OTP");
    }
    finally{
      setSendingOtp(false)
    }
  };

  // timer for resend otp
  useEffect(() => {
    if (!otpSent || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleVerifyOtp = async() => {
    setVerifyingOtp(true)
    console.log("otp is", form.otp)

    try {
      const res = await fetch(SummaryApi.verifyOtp.url, {
        method: SummaryApi.verifyOtp.method,
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email: form.email, otp: form.otp })
      })
      
      const data = await res.json()
      if(res.ok && data.verified){
        setOtpVerified(true)
        toast.success("OTP verified")
      }
      else{
        toast.warning("Something went wrong")
      }
    } 
    catch (err) {
      console.error(err);
      toast.error("Verification failed");
    }
    finally{
      setVerifyingOtp(false)
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const err = validate();
    setError(err);
    if (Object.keys(err).length !== 0) {
      //display error
      return 
    }

    try {
      setLoading(true)
      const res = await fetch(SummaryApi.signUp.url, {
        method: SummaryApi.signUp.method,
        headers:{
          "content-type": "application/json"
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if(data.success) {
        console.log("dataApi message from success: ", data.message)
        toast.success(data.message)
        navigate("/login")
      }
      if(data.error) {
        console.log("dataApi message from error: ", data.message)
        toast.error(data.message)
      }
    } catch (err) {
      toast.warning("Something went wrong")
      console.log(err)
    }
    finally{
      setLoading(false)
    }
  };
 

  return (
    <section className='w-full h-full max-md:w-full flex justify-center items-center'>
        <div className='absolute top-4 right-4'>
          <ThemeToggle />
        </div>
        <div className='w-1/2 flex flex-col gap-4'>
          <p className='text-8xl max-sm:text-5xl font-bold text-center tracking-widest'>Sanyug</p>
          <p className='text-5xl max-sm:text-3xl font-bold text-center opacity-75'>Create an account</p>
          
          {/* input profile data */}
          <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
              <div className='flex gap-4'>
                  <input placeholder='First name' name='firstName' required className='input-field' value={form.firstName} onChange={handleOnChange}/>
                  <input placeholder='Last name' name='lastName' required className='input-field' value={form.lastName} onChange={handleOnChange} />
              </div>

              <div className="flex gap-2">
                  <input placeholder='Email' type='email' name='email' required className='input-field' value={form.email} onChange={handleOnChange} />
                  <div className=" w-36 mx-auto">
                    {sendingOtp ? ( <div className="loader mx-auto"></div>
                    ) : (
                      <button onClick={handleSendOtp}
                        className={`w-full text-center ${timer > 0 ? 'btn-disabled opacity-50 cursor-not-allowed' : 'btn-blue'}`}
                        disabled={timer > 0}
                      >
                        {timer > 0 ? `Wait ${timer}s` : 'Send OTP'}
                      </button>
                    )}
                  </div>
              </div>
              { otpSent && timer > 0 && (
                <div className="ml-2 -my-2 text-sm ">
                  OTP sent. Request another OTP in {timer}s
                </div>
              )}

              <div className="flex gap-2 my-auto">
                <input placeholder="Enter OTP" type="number" name="otp" required className="input-field" value={form.otp} onChange={handleOnChange} disabled={otpVerified}/>
                { !otpVerified ? ( 
                  <button onClick={handleVerifyOtp} className="btn-green w-34" disabled={verifyingOtp}> {verifyingOtp ? "Verifying" : "Verify OTP"} </button> 
                  ) : (
                    <span className="w-36 flex items-center justify-center gap-1 bg-slate-200 dark:bg-slate-700 text-green-600 font-medium rounded-lg px-2 py-1">
                      <FaRegCheckCircle /> Verified
                    </span>
                  )
                }
              </div>
              
              <label htmlFor="password" className=' flex justify-between items-center relative'>
                  <input id='password' placeholder='password' name='password' required value={form.password} onChange={handleOnChange} type={showPassword ? "text" : "password"} className='input-field outline-none border-0 ' />
                  <i onClick={() => setShowPassword((prev) => !prev)} className='cursor-pointer absolute right-4'> {showPassword ? (<FaEyeSlash />) : (<FaEye />)}
                  </i>
              </label>
              {error.password && <span className="ml-2 -my-2 text-sm text-red-500">{error.password}</span>}
              
              <input placeholder='confirm password' type='password' name='confirmPassword' required value={form.confirmPassword} onChange={handleOnChange} className='input-field' />
              {error.confirmPassword && <span className="ml-2 -my-2 text-sm text-red-500">{error.confirmPassword}</span>}
              
              { otpVerified ? (
                <button className='btn'>{loading ? "Creating..." : "Create Account"} </button>
                ) : (
                  <span className="btn-disabled text-center">Create Account</span>
                ) 
              }
              {/* <button 
                className={`btn ${!otpVerified ? 'btn-disabled cursor-not-allowed' : ''}`} 
                disabled={!otpVerified}
              >
                Create Account
              </button> */}
              
          </form>

          <span>Already have an account?  
              <Link to='/login' className="active-link"> Log in </Link>
          </span>

          {/* Divider */}
          <div className='w-full flex items-center gap-4 my-2'>
              <div className='flex-1 h-[1px] bg-slate-300 dark:bg-slate-600'></div>
              <span className='text-slate-500 dark:text-slate-400 text-sm'>or</span>
              <div className='flex-1 h-[1px] bg-slate-300 dark:bg-slate-600'></div>
          </div>

          {/* Google Login */}
          <div className='w-full'>
              <GoogleLogin/>
          </div>
        </div>

    </section>
  );
};

export default Register;
