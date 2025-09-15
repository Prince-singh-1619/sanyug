import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { disconnectSocket, getSocket } from '../socket/socket'
import { useDispatch } from "react-redux";
import { clearChatState } from '../redux/slices/chatSlice'
import { clearConvoState } from '../redux/slices/convoSlice';

const MyProfile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const socket = getSocket()

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.userId;

    const handleLogout = () =>{
        if(socket){
            socket.emit("user_logout", {userId});
            disconnectSocket();
            dispatch(clearChatState());
            dispatch(clearConvoState());
        }
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