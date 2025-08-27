import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const MyProfile = () => {
    const navigate = useNavigate()

    const handleLogout = () =>{
        localStorage.removeItem("userData")
        localStorage.removeItem("authToken")
        toast.success("Logged out successfully")
        navigate('/login')
    }

    return (
        <section className='w-1/4 h-1/4 flex justify-center items-center'>
            <div onClick={handleLogout} className='w-24 h-18 flex justify-center items-center rounded-lg bg-transparent hover:bg-slate-500 hover:text-white cursor-pointer '>Logout</div>
        </section>
    )
}

export default MyProfile