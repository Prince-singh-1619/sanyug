import React, { useEffect, useRef } from 'react'
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from 'react-redux';
dayjs.extend(relativeTime);
import dummyDp from '../assets/person-dummy.svg'
import { MdClose, MdVerifiedUser } from 'react-icons/md';
import ImagePopup from './ImagePopup';

const NextUserProfile = ({ user, isOpen, onClose}) => {
    const { userData } = useSelector(state => state.user)
    const userId = userData?._id
    const otherUser = user.participants.find(p => p._id !== userId);

    const [isImagePopup, setIsImagePopup] = useState(false)

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    const formatTimestamp = (dateString) =>{
        const date = new Date(dateString);
        const now = new Date();

        // Helper to zero out time for date comparison
        const stripTime = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());

        const today = stripTime(now);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // Today -> show time
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // }
    }

    const dialogRef = useRef(null)
    useEffect(()=>{
        const handleClickOutside = (e) =>{
            if(dialogRef.current && !dialogRef.current.contains(e.target)){
                onClose()
            }
        }

        if(isOpen){
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () =>{
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if(!isOpen) return null

  return (
    <section className='fixed inset-0 backdrop-blur-xs w-full h-full z-50 '>
        <div ref={dialogRef} className="relative h-fit w-1/2 max-md:w-full max-[425px]:w-full flex flex-col items-center py-4 mt-8 mx-auto bg-slate-300 dark:bg-[#151515] shadow-xl rounded-lg">
            {/* Profile Picture */}
            <div className="relative group">
                <img src={user.profilePic?.lowResPic || dummyDp} alt="Profile" onClick={()=>setIsImagePopup(true)} className="w-32 h-32 mx-auto rounded-xl border-4 border-slate-500 shadow-lg object-cover lazy-loading cursor-pointer" />
                <div title='verified' className={` ${!otherUser.isVerified ? 'hidden':'absolute'} bottom-1 right-1 bg-slate-300 dark:bg-[#1a1a1a] p-1 rounded-full shadow-md`}>
                    <MdVerifiedUser className='text-2xl text-green-700 dark:text-green-500'/>
                </div>
                <ImagePopup url={otherUser?.profilePic?.highResPic} lowRes={user?.profilePic?.lowResPic} isOpen={isImagePopup} onClose={()=>setIsImagePopup(false)} />
            </div>

            {/* User Info */}
            <div className="w-full flex">
                <div className="mx-auto flex max-[425]:block flex-col flex-wrap gap-2 ">
                    <h1 className="text-4xl max-[425px]:text-3xl font-bold text-center text-nowrap capitalize">{user.name}</h1>
        
                    <div className='w-full flex max-[425px]:flex-col max-[425px]:items-start items-center justify-start gap-2 max-[425px]:gap-0'>
                        <span className='opacity-85'>Username:</span>
                        <p className="text-2xl max-[425px]:text-xl font-semibold break-all">{otherUser.username}</p>
                    </div>
                    {/* <div className='w-full flex max-[425px]:flex-col max-[425px]:items-start items-center justify-start gap-2 max-[425px]:gap-0'>
                        <span className='opacity-85'>Email:</span>
                        <p className="text-xl max-[425px]:text-lg font-semibold break-all">{user.email}</p>
                    </div> */}
                    <div className='w-full flex max-[425px]:items-start items-center justify-start gap-2 capitalize'>
                        <span className='opacity-85'>Status:</span>
                        <p className="text-lg max-[425px]:text-md font-semibold break-all">{otherUser.status}</p>
                    </div>
                    <div className='flex items-center justify-start gap-2 '>
                        <span className='opacity-85'>Last Seen at:</span>
                        <p className="text-lg font-semibold">{formatTimestamp(otherUser.lastSeen)}</p>
                    </div>
                    <div className='flex items-center justify-start gap-2 '>
                        <span className='opacity-85'>Using since:</span>
                        <p className="text-lg max-[425px]:text-md font-semibold">{formatDate(otherUser?.createdAt)}</p>
                    </div>
                </div>
            </div>

            <div onClick={onClose} className="absolute top-2 right-2 text-xl cursor-pointer"> <MdClose/> </div> 
        </div>
    </section>
  )
}

export default NextUserProfile