import React, { useEffect, useState } from 'react'
import SummaryApi from '../helpers/SummaryApi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const [showPassword, setShowPassword] = useState(false)
    // const navigate = useNavigate()
    
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
            if(data.success) {
                console.log("dataApi message from success: ", data.message)
                toast.success(data.message)
                // navigate("/")
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
        <div className='w-1/2 flex flex-col gap-4'>
            <p className='text-8xl max-sm:text-5xl font-bold text-center tracking-widest'>Sanyug</p>
            <p className='text-5xl max-sm:text-3xl font-bold text-center opacity-75'>Login</p>
            
            {/* input profile data */}
            <form onSubmit={handleSubmit} className='w-[90%] flex flex-col gap-4'>
                <input placeholder='Email' type='email' name='email' required className='input-field' value={form.email} onChange={handleOnChange} />

                <label htmlFor="password" className=' flex justify-between items-center relative'>
                    <input id='password' placeholder='password' name='password' required value={form.password} onChange={handleOnChange} type={showPassword ? "text" : "password"} className='input-field outline-none border-0 ' />
                    <i onClick={() => setShowPassword((prev) => !prev)} className='cursor-pointer absolute right-4'> {showPassword ? (<FaEyeSlash />) : (<FaEye />)}
                    </i>
                </label>
                <Link to={'/forgot-password'} className='active-link text-right -mt-2 mb-2'>forgot password?</Link>
                
                <button className='btn'>{loading ? "Creating..." : "Create Account"} </button>
            </form>

            <span>Don't have an existing account?  
                <Link to='/register' className="active-link"> Register </Link>
            </span>
        </div>

    </section>
  )
}

export default Login