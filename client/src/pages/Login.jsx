import React, { useEffect, useState } from 'react'
import SummaryApi from '../helpers/SummaryApi';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';
import GoogleLogin from '../components/GoogleLogin';
import { connectSocket } from '../socket/socket';
import { setAuthToken, setUserData } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // const socket = connectSocket();
    
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const err = {};
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) err.email = "Valid email required";
        return err;
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
            const res = await fetch(SummaryApi.login.url, {
                method: SummaryApi.login.method,
                headers:{
                    "content-type": "application/json"
                },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if(data.success && data.token && data.user) {
                console.log("dataApi message from success: ", data.message)

                localStorage.setItem("authToken", data.token);

                dispatch(setAuthToken({authToken:data.token}))
                dispatch(setUserData({userData:data.user}))
                console.log("dispatch called...........")

                toast.success(data.message)
                navigate("/")
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
    <section className='w-full h-full mt-10 max-md:w-full flex justify-center items-center  transition-colors'>
        <div className='absolute top-4 right-4'>
            <ThemeToggle />
        </div>
        <div className='min-md:w-1/2 flex flex-col gap-4 items-center justify-start'>
            <div className='flex items-center gap-2 '>   
                <img src={'/logo.png'} alt='logo' className='w-20 h-20'/>
                <p className='text-8xl max-sm:text-5xl font-bold text-center tracking-widest text-gray-900 dark:text-white'>Sanyug</p>
            </div>
            <p className='text-5xl max-sm:text-3xl font-bold text-center opacity-75 text-gray-700 dark:text-gray-300'>Login</p>
            
            {/* input profile data */}
            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
                <input placeholder='Email' type='email' name='email' required className='input-field' value={form.email} onChange={handleOnChange} />

                <label htmlFor="password" className=' flex justify-between items-center relative'>
                    <input id='password' placeholder='password' name='password' required value={form.password} onChange={handleOnChange} type={showPassword ? "text" : "password"} className='input-field outline-none border-0 ' />
                    <i onClick={() => setShowPassword((prev) => !prev)} className='cursor-pointer absolute right-4 text-gray-600 dark:text-gray-400'> {showPassword ? (<FaEyeSlash />) : (<FaEye />)}
                    </i>
                </label>
                <Link to={'/forgot-password'} className='active-link text-right -mt-2 mb-2'>forgot password?</Link>
                
                <button className='btn'>{loading ? "Logging in..." : "Log in"} </button>
            </form>

            <span className='text-gray-700 dark:text-gray-300 mr-auto'>Don't have an existing account?  
                <Link to='/register' className="active-link"> Register </Link>
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
  )
}

export default Login