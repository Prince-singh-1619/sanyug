import React, { useState } from 'react'
import SummaryApi from '../helpers/SummaryApi'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    // const [loading, setLoading] = useState(false)
    // const [email, setEmail] = useState('')
    
    // const handleSubmit = async(e) => {
    //     e.preventDefault()
    //     setLoading(true)

    //     try {
    //         const res = await fetch(SummaryApi.forgotPassword.url, {
    //             method: SummaryApi.forgotPassword.method,
    //             headers: {
    //                 "Content-Type" : "application/json",
    //             },
    //             body: JSON.stringify({email})
    //         })

    //         const resData = await res.json()
    //         if(resData.success){
    //             toast.success(resData.message)
    //         }
    //         if(resData.error){
    //             toast.warning(resData.message)
    //         }
    //     } 
    //     catch (error) {
    //         toast.warning(error?.message || 'Something went wrong')
    //     }
    //     finally{
    //         setLoading(false)
    //     }
    // }


    const [step, setStep] = useState(1); // 1: send OTP, 2: verify OTP and reset password
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(SummaryApi.forgotPassword.url, {
                method: SummaryApi.forgotPassword.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                setStep(2); // Move to OTP entry + password reset
            } else {
                toast.warning(data.message);
            }
        } 
        catch (error) {
            toast.error(error.message || "Something went wrong");
        } 
        finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
        const res = await fetch(SummaryApi.resetPassword.url, {
            method: SummaryApi.resetPassword.method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, newPassword })
        });

        const data = await res.json();

        if (data.success) {
            toast.success("Password reset successful!");
            // Optionally redirect to login
        } else {
            toast.warning(data.message);
        }
        } catch (error) {
        toast.error(error.message || "Reset failed");
        } finally {
        setLoading(false);
        }
    };
  return (
    // <div className="w-[50%] h-[80vh] flex flex-col gap-8 justify-center items-center mx-auto">
    //   <h2 className='text-5xl max-sm:text-3xl font-bold text-center'>Forgot Password</h2>
    //   <form onSubmit={handleSubmit} className='flex flex-col'>
    //     <input
    //       type="email"
    //       placeholder="Enter your registered email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       className='mx-auto input-field min-w-78'
    //       required
    //     />
    //     <button type="submit" className='btn btn-bg btn-plus mt-4'>{loading ? 'Sending...' : 'Send Reset Link'}</button>
    //   </form>
    // </div>

    <div className="w-[50%] h-[80vh] flex flex-col gap-8 justify-center items-center mx-auto">
      <h2 className='text-5xl max-sm:text-3xl font-bold text-center'>Forgot Password</h2>

      {step === 1 && (
        <form onSubmit={handleSendOtp} className='flex flex-col'>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='mx-auto input-field min-w-78'
            required
          />
          <button type="submit" className='btn btn-bg btn-plus mt-4'>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className='flex flex-col gap-4'>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className='mx-auto input-field min-w-78'
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='mx-auto input-field min-w-78'
            required
          />
          <button type="submit" className='btn btn-bg btn-plus mt-2'>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ForgotPassword